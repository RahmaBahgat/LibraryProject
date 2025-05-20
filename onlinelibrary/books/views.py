from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.core.serializers import serialize
import json
from .models import Book, BorrowedBook, Notification, User, Genre, BookReview, UserProfile
from .forms import BookForm
from django.urls import reverse
from django.utils import timezone
from .services import BookRecommendationService
from django.db.models import Q, Count
from django.core.exceptions import PermissionDenied
import os
from django.conf import settings
from datetime import timedelta

def get_notifications(request):
    """Helper function to get notifications for a user"""
    # Only return notifications for authenticated users and specific pages
    if not request.user.is_authenticated:
        return {}
        
    # List of paths where notifications should not be included
    excluded_paths = ['/login/', '/signup/', '/about/', '/privacy/', '/terms/', '/faq/', '/help/']
    if request.path in excluded_paths:
        return {}
        
    # Only include notifications in dropdown and notification pages
    if 'notifications' not in request.path and request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        return {'unread_notifications_count': Notification.objects.filter(
            Q(recipient=request.user) | Q(recipient__isnull=True, notification_type='global'),
            is_read=False
        ).count()}
        
    notifications = Notification.objects.filter(
        Q(recipient=request.user) | Q(recipient__isnull=True, notification_type='global')
    ).order_by('-created_at')[:5]
    
    unread_count = Notification.objects.filter(
        Q(recipient=request.user) | Q(recipient__isnull=True, notification_type='global'),
        is_read=False
    ).count()
    
    return {
        'notifications': notifications,
        'unread_notifications_count': unread_count
    }

def is_admin(user):
    return user.is_staff

def get_books_json():
    """Helper function to get books data as JSON"""
    try:
        books = Book.objects.all()
        books_data = []
        for book in books:
            books_data.append({
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'category': book.category.name if book.category else '',
                'genres': [g.name for g in book.genres.all()],
                'image': book.image.url if book.image else '',
                'cover_path': book.cover_path if hasattr(book, 'cover_path') else '',
            })
        return json.dumps(books_data)
    except Exception as e:
        print(f"Error getting books JSON: {str(e)}")
        return json.dumps([])

@login_required
def book_detail(request, id):
    book = get_object_or_404(Book, id=id)
    recommendation_service = BookRecommendationService(request.user)
    similar_books = recommendation_service.get_similar_books(book)
    
    # Ensure similar_books is a list
    if similar_books is None:
        similar_books = []
    elif not isinstance(similar_books, (list, tuple)):
        similar_books = list(similar_books)
    
    # Get or create user review
    user_review = BookReview.objects.filter(book=book, user=request.user).first()
    
    # Check if this book is borrowed by the user
    is_borrowed = BorrowedBook.objects.filter(
        book=book, 
        user=request.user,
        is_returned=False
    ).exists()
    
    # Check if this book is in user's favorites
    is_favorite = request.user.profile.favorite_books.filter(id=book.id).exists()
    
    context = {
        'book': book,
        'similar_books': similar_books,
        'user_review': user_review,
        'reviews': book.reviews.exclude(user=request.user),
        'is_borrowed': is_borrowed,
        'is_favorite': is_favorite,
        'genre_names': book.genres.values_list('name', flat=True),
        **get_notifications(request)
    }
    
    return render(request, 'bookPage.html', context)

@login_required
def toggle_borrow(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    
    # Check if book is already borrowed by user
    borrowed = BorrowedBook.objects.filter(
        book=book,
        user=request.user,
        is_returned=False
    ).first()
    
    if borrowed:
        # Return the book
        borrowed.is_returned = True
        borrowed.return_date = timezone.now()
        borrowed.save()
        
        # Update book stock
        book.stock += 1
        book.save()
        
        is_borrowed = False
        # Send notification for returning book
        Notification.objects.create(
            recipient=request.user,
            title='Book Returned',
            message=f"'{book.title}' has been returned successfully",
            notification_type='personal',
            related_book=book
        )
    else:
        # Check if book is available
        if book.stock > 0:
            # Borrow the book
            BorrowedBook.objects.create(
                user=request.user,
                book=book
            )
            book.stock -= 1
            book.save()
            
            is_borrowed = True
            # Send notification for borrowing book
            Notification.objects.create(
                recipient=request.user,
                title='Book Borrowed',
                message=f"'{book.title}' has been borrowed successfully",
                notification_type='personal',
                related_book=book
            )
            
            # Notify admins about book being borrowed
            admins = User.objects.filter(is_staff=True)
            for admin in admins:
                Notification.objects.create(
                    recipient=admin,
                    title='Book Borrowed',
                    message=f"User {request.user.username} has borrowed '{book.title}'",
                    notification_type='system',
                    related_book=book
                )
        else:
            return JsonResponse({
                'success': False,
                'message': 'Book is out of stock'
            })
    
    return JsonResponse({
        'success': True,
        'is_borrowed': is_borrowed,
        'message': 'Borrow status updated successfully'
    })

@login_required
def borrowed_list(request):
    # Get all non-returned books borrowed by the user
    user_borrowed = BorrowedBook.objects.filter(
        user=request.user,
        is_returned=False
    ).select_related('book')
    
    # Calculate due dates (14 days from borrow date)
    for borrowed in user_borrowed:
        borrowed.due_date = borrowed.borrow_date + timedelta(days=14)
    
    context = {
        'borrowed_books': user_borrowed,
        **get_notifications(request)
    }
    return render(request, 'borrowed_list.html', context)

@login_required
def toggle_favorite(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    user_profile = request.user.profile
    
    if book in user_profile.favorite_books.all():
        user_profile.favorite_books.remove(book)
        is_favorite = False
        # Send notification for removing from favorites
        Notification.objects.create(
            recipient=request.user,
            title='Book Removed from Favorites',
            message=f"'{book.title}' has been removed from your favorites",
            notification_type='personal',
            related_book=book
        )
    else:
        user_profile.favorite_books.add(book)
        is_favorite = True
        # Send notification for adding to favorites
        Notification.objects.create(
            recipient=request.user,
            title='Book Added to Favorites',
            message=f"'{book.title}' has been added to your favorites",
            notification_type='personal',
            related_book=book
        )
        
        # Notify admins about popular books (optional)
        favorite_count = UserProfile.objects.filter(favorite_books=book).count()
        if favorite_count in [10, 50, 100]:  # Milestone numbers
            admins = User.objects.filter(is_staff=True)
            for admin in admins:
                Notification.objects.create(
                    recipient=admin,
                    title='Popular Book Alert',
                    message=f"'{book.title}' has reached {favorite_count} favorites!",
                    notification_type='system',
                    related_book=book
                )
    
    return JsonResponse({
        'success': True,
        'is_favorite': is_favorite,
        'message': 'Favorite status updated successfully'
    })

@login_required
def favorites(request):
    user_favorites = request.user.profile.favorite_books.all()
    context = {
        'favorite_books': user_favorites,
        **get_notifications(request)
    }
    return render(request, 'FavouriteBooks.html', context)

// ... existing code ...

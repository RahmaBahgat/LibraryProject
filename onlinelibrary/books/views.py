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
    """Rest of the function remains unchanged"""
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
@user_passes_test(is_admin)
def admin_book_management(request):
    # Get all books
    books = Book.objects.all().order_by('-created_at')
    
    # Get statistics
    total_books = Book.objects.count()
    borrowed_count = BorrowedBook.objects.filter(is_returned=False).count()
    total_users = User.objects.count()
    total_reviews = BookReview.objects.count()
    
    # Get books by badge
    new_releases = books.filter(badge='new-release')[:10]
    trending_books = books.filter(badge='trending')[:10]
    bestsellers = books.filter(badge='bestseller')[:10]
    
    # Get highly rated books
    highly_rated = books.filter(average_rating__gte=4.0).order_by('-average_rating')[:10]
    
    context = {
        'books': books,
        'total_books': total_books,
        'borrowed_count': borrowed_count,
        'total_users': total_users,
        'total_reviews': total_reviews,
        'new_releases': new_releases,
        'trending_books': trending_books,
        'bestsellers': bestsellers,
        'highly_rated': highly_rated,
        'books_json': get_books_json(),
        **get_notifications(request)
    }
    return render(request, 'books/admin_book_management.html', context)

@login_required
@user_passes_test(is_admin)
def list_books(request):
    books = Book.objects.all()
    print("Loading books from database...")
    print(f"Total books found: {books.count()}")
    
    # Load book cover paths from data.js
    try:
        import re
        
        # Get all available image files
        images_dir = os.path.join(settings.BASE_DIR.parent, 'onlinelibrary', 'Static', 'images', 'books')
        print(f"Looking for images in: {images_dir}")
        
        if os.path.exists(images_dir):
            available_files = {f.lower(): f for f in os.listdir(images_dir) if f.endswith(('.jpg', '.jpeg', '.png'))}
            print(f"Available image files: {available_files}")
            
            # Path to the data.js file
            data_js_path = os.path.join(settings.BASE_DIR.parent, 'onlinelibrary', 'Static', 'js', 'data.js')
            print(f"Looking for data.js at: {data_js_path}")
            
            if os.path.exists(data_js_path):
                print("Found data.js file")
                with open(data_js_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                    # Extract book titles and cover paths using regex
                    pattern = r'title:\s*"([^"]+)".*?cover:\s*"([^"]+)"'
                    matches = re.findall(pattern, content, re.DOTALL)
                    print(f"Found {len(matches)} book cover mappings")
                    
                    # Create a mapping of titles to cover paths
                    cover_paths = {title.strip(): path.strip() for title, path in matches}
                    
                    # Add cover paths to all books
                    for book in books:
                        book_title = book.title.strip()
                        print(f"\nProcessing book: {book_title}")
                        
                        if book.image:
                            book.cover_path = book.image.url
                            print(f"Book '{book_title}' has image: {book.cover_path}")
                        elif book_title in cover_paths:
                            # Get the filename from the path
                            cover_path = cover_paths[book_title]
                            filename = os.path.basename(cover_path)
                            print(f"Looking for file: {filename}")
                            
                            # Try to find the file (case-insensitive)
                            if filename.lower() in available_files:
                                actual_filename = available_files[filename.lower()]
                                static_path = f"images/books/{actual_filename}"
                                print(f"Found file: {static_path}")
                                book.cover_path = static_path
                            else:
                                print(f"File not found: {filename}")
                                book.cover_path = 'images/books/default-cover.jpg'
                        else:
                            print(f"No cover path found for book: {book_title}")
                            book.cover_path = 'images/books/default-cover.jpg'
            else:
                print("data.js file not found!")
                for book in books:
                    book.cover_path = 'images/books/default-cover.jpg'
        else:
            print("Images directory not found!")
            for book in books:
                book.cover_path = 'images/books/default-cover.jpg'
    except Exception as e:
        print(f"Error loading book cover paths: {str(e)}")
        for book in books:
            book.cover_path = 'images/books/default-cover.jpg'
    
    # Convert books to JSON for JavaScript
    books_json = json.dumps([{
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'image': book.cover_path,
        'category': book.genre if hasattr(book, 'genre') else None
    } for book in books])
    
    print("Books data prepared for JavaScript")
    return render(request, 'books/book_list.html', {
        'books': books,
        'books_json': books_json
    })

@login_required
@user_passes_test(is_admin)
def add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            book = form.save(commit=False)
            book.badge = 'new'  # Set the badge to 'new' for new books
            book.save()
            form.save_m2m()  # Save many-to-many relationships
            
            # Send notification for new book
            Notification.send_book_notification(
                notification_type='book_added',
                book=book,
                admin_user=request.user,
                message=f"New book '{book.title}' has been added to the library"
            )
            messages.success(request, 'Book added successfully!')
            return redirect('books_admin:admin_book_management')
    else:
        form = BookForm()
    return render(request, 'books/book_form.html', {'form': form, 'action': 'Add'})

@login_required
@user_passes_test(is_admin)
def edit_book(request, id):
    book = get_object_or_404(Book, id=id)
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            book = form.save()
            # Send notification for book edit
            Notification.send_book_notification(
                notification_type='book_edited',
                book=book,
                admin_user=request.user,
                message=f"Book '{book.title}' has been updated"
            )
            messages.success(request, 'Book updated successfully!')
            return redirect('books_admin:admin_book_management')
    else:
        form = BookForm(instance=book)
    return render(request, 'books/book_form.html', {'form': form, 'book': book, 'action': 'Edit'})

@login_required
@user_passes_test(is_admin)
def delete_book(request, id):
    book = get_object_or_404(Book, id=id)
    title = book.title  # Store title before deletion
    book.delete()
    # Send notification for book removal
    Notification.send_book_notification(
        notification_type='book_removed',
        book=None,  # Book is already deleted
        admin_user=request.user,
        message=f"Book '{title}' has been removed from the library"
    )
    messages.success(request, 'Book deleted successfully!')
    return redirect('books_admin:admin_book_management')

@login_required
@user_passes_test(is_admin)
def api_list_books(request):
    books = Book.objects.all().order_by('-created_at')
    books = [book for book in books if book.image and os.path.exists(os.path.join(settings.MEDIA_ROOT, book.image.name))]
    books_data = [{
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'description': book.description,
        'isbn': book.isbn,
        'price': str(book.price),
        'stock': book.stock,
        'image': book.image.url if book.image else None,
        'created_at': book.created_at.isoformat()
    } for book in books]
    return JsonResponse({'books': books_data})

def api_featured_books(request):
    """API endpoint to get featured books for the carousel"""
    # Get the category requested in the query parameter
    category = request.GET.get('category', 'all')
    
    # Start with all books
    books = Book.objects.all()
    
    # Filter based on category
    if category == 'new_releases':
        books = books.filter(badge='new-release')[:10]
    elif category == 'trending':
        books = books.filter(badge='trending')[:10]
    elif category == 'bestsellers':
        books = books.filter(badge='bestseller')[:10]
    elif category == 'highly_rated':
        books = books.filter(average_rating__gte=4.0).order_by('-average_rating')[:10]
    elif category == 'coming_soon':
        books = books.filter(badge='coming-soon')[:10]
    elif category.startswith('genre_'):
        # Extract genre name from the category parameter
        genre_name = category.replace('genre_', '')
        books = books.filter(genres__name=genre_name).distinct()[:10]
    else:
        # All featured books
        books = books.order_by('-created_at')[:10]
    
    # Convert to JSON response
    books_data = [{
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'image': book.image.url if book.image else None,
        'badge': book.badge,
        'average_rating': book.average_rating,
        'created_at': book.created_at.isoformat()
    } for book in books]
    
    return JsonResponse({'books': books_data})

def api_book_categories(request):
    """API endpoint to get all available book categories with counts"""
    # Get all available genres
    genres = Genre.objects.all()
    
    # Get counts for badge-based categories
    new_releases_count = Book.objects.filter(badge='new-release').count()
    trending_count = Book.objects.filter(badge='trending').count()
    bestsellers_count = Book.objects.filter(badge='bestseller').count()
    highly_rated_count = Book.objects.filter(average_rating__gte=4.0).count()
    coming_soon_count = Book.objects.filter(badge='coming-soon').count()
    
    # Build response data
    categories = [
        {'id': 'new_releases', 'name': 'New Releases', 'count': new_releases_count, 'icon': 'fa-star'},
        {'id': 'trending', 'name': 'Trending Now', 'count': trending_count, 'icon': 'fa-fire'},
        {'id': 'bestsellers', 'name': 'Bestsellers', 'count': bestsellers_count, 'icon': 'fa-crown'},
        {'id': 'highly_rated', 'name': 'Highly Rated', 'count': highly_rated_count, 'icon': 'fa-star'},
        {'id': 'coming_soon', 'name': 'Coming Soon', 'count': coming_soon_count, 'icon': 'fa-hourglass-half'}
    ]
    
    # Add genres as categories
    for genre in genres:
        genre_count = Book.objects.filter(Q(genre=genre.name) | Q(genres=genre)).distinct().count()
        if genre_count > 0:
            categories.append({
                'id': f'genre_{genre.name}',
                'name': genre.name,
                'count': genre_count,
                'icon': 'fa-book',
                'is_genre': True
            })
    
    return JsonResponse({'categories': categories})

def non_staff_required(function):
    def wrap(request, *args, **kwargs):
        if request.user.is_staff:
            return redirect('admin_home')
        return function(request, *args, **kwargs)
    return wrap

@login_required
@non_staff_required
def home_user(request):
    # Print all book titles loaded from the database
    all_books = Book.objects.all()
    print([book.title for book in all_books])
    
    # Get user's borrowed books
    borrowed_books = BorrowedBook.objects.filter(user=request.user, is_returned=False)
    
    # Get books by badge and recently added books
    new_releases = Book.objects.filter(
        Q(badge='new') |  # Books with 'new' badge
        Q(created_at__gte=timezone.now() - timezone.timedelta(days=30))  # Books added in last 30 days
    ).order_by('-created_at')[:10]
    trending_books = Book.objects.filter(badge='trending')[:10]
    bestsellers = Book.objects.filter(badge='bestseller')[:10]
    
    # Get highly rated books (4+ rating)
    highly_rated_books = Book.objects.filter(average_rating__gte=4.0).order_by('-average_rating')[:10]
    
    # Get recommended books based on user's preferences
    recommendation_service = BookRecommendationService(request.user)
    recommended_books = recommendation_service.get_recommendations(limit=10)
    
    # Get similar books if user has borrowed books
    similar_books = []
    if borrowed_books.exists():
        latest_borrowed = borrowed_books.order_by('-borrow_date').first().book
        similar_books = recommendation_service.get_similar_books(latest_borrowed, limit=10)
    
    # Get user notifications
    notifications = Notification.objects.filter(
        Q(recipient=request.user) | Q(recipient__isnull=True, notification_type='global')
    ).order_by('-created_at')[:10]
    
    # User stats
    total_borrowed = BorrowedBook.objects.filter(user=request.user).count()
    currently_borrowed = borrowed_books.count()
    
    # Calculate favorite genres based on user's history
    favorite_genres = []
    if total_borrowed > 0:
        genre_counts = {}
        user_borrowed_books = BorrowedBook.objects.filter(user=request.user).select_related('book')
        for borrowed in user_borrowed_books:
            for genre in borrowed.book.genres.all():
                genre_name = genre.name
                if genre_name:
                    genre_counts[genre_name] = genre_counts.get(genre_name, 0) + 1
        
        # Get the top 3 genres
        if genre_counts:
            favorite_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    
    # Load book cover paths from data.js
    try:
        import re
        
        # Path to the data.js file
        data_js_path = os.path.join(settings.BASE_DIR, 'Static', 'js', 'data.js')
        cover_paths = {}
        
        if os.path.exists(data_js_path):
            with open(data_js_path, 'r', encoding='utf-8') as file:
                content = file.read()
                # Extract book titles and cover paths using regex
                pattern = r'title:\s*"([^"]+)".*?cover:\s*"([^"]+)"'
                matches = re.findall(pattern, content, re.DOTALL)
                
                for title, cover_path in matches:
                    # Convert relative path to static path format
                    static_path = cover_path.replace('../', '')
                    cover_paths[title] = static_path
        
        # Add cover_path to each book object
        for book_list in [new_releases, trending_books, bestsellers, highly_rated_books, recommended_books, similar_books]:
            if book_list:  # Check if the list exists and is not None
                for book in book_list:
                    if book.title in cover_paths:
                        book.cover_path = cover_paths[book.title]
    except Exception as e:
        print(f"Error loading book cover paths: {str(e)}")
    
    # Add books_json for search functionality
    books_json = json.dumps([
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "category": book.genre if hasattr(book, 'genre') and book.genre else "",
            "image": book.image.url if book.image else "/static/images/books/default-cover.jpg"
        }
        for book in all_books
    ])
    
    context = {
        'all_books': all_books,
        'new_releases': new_releases,
        'trending_books': trending_books,
        'bestsellers': bestsellers,
        'highly_rated_books': highly_rated_books,
        'recommended_books': recommended_books,
        'similar_books': similar_books,
        'notifications': notifications,
        'total_borrowed': total_borrowed,
        'currently_borrowed': currently_borrowed,
        'favorite_genres': favorite_genres,
        'books_json': books_json,
    }
    
    return render(request, 'HomePage-user.html', context)

@login_required
@user_passes_test(is_admin)
def home_admin(request):
    # Get all books
    all_books = Book.objects.all()
    
    # Get recent books
    recent_books = Book.objects.order_by('-created_at')[:10]
    
    # Get books by badge
    new_releases = Book.objects.filter(badge='new').order_by('-created_at')[:10]
    trending_books = Book.objects.filter(badge='trending')[:10]
    
    # Get books by badge
    bestsellers = Book.objects.filter(badge='bestseller')[:10]
    
    # Get highly rated books
    highly_rated = Book.objects.filter(average_rating__gte=4.0).order_by('-average_rating')[:10]
    
    # Get notifications
    notifications = Notification.objects.filter(
        Q(recipient=request.user) | Q(recipient__isnull=True, notification_type='global')
    ).order_by('-created_at')[:10]
    
    # Load book cover paths from data.js
    try:
        import re
        
        # Path to the data.js file
        data_js_path = os.path.join(settings.BASE_DIR, 'Static', 'js', 'data.js')
        cover_paths = {}
        
        if os.path.exists(data_js_path):
            with open(data_js_path, 'r', encoding='utf-8') as file:
                content = file.read()
                # Extract book titles and cover paths using regex
                pattern = r'title:\s*"([^"]+)".*?cover:\s*"([^"]+)"'
                matches = re.findall(pattern, content, re.DOTALL)
                
                for title, cover_path in matches:
                    # Convert relative path to static path format
                    static_path = cover_path.replace('../', '')
                    cover_paths[title] = static_path
        
        # Add cover_path to each book object
        for book_list in [recent_books, new_releases, trending_books, bestsellers, highly_rated]:
            if book_list:  # Check if the list exists and is not None
                for book in book_list:
                    if book.title in cover_paths:
                        book.cover_path = cover_paths[book.title]
                    elif not book.image:  # If no image and no cover path found, set default
                        book.cover_path = 'images/books/default-cover.jpg'
    except Exception as e:
        print(f"Error loading book cover paths: {str(e)}")
    
    context = {
        'all_books': all_books,
        'recent_books': recent_books,
        'new_releases': new_releases,
        'trending_books': trending_books,
        'bestsellers': bestsellers,
        'highly_rated': highly_rated,
        'notifications': notifications,
        'books_json': get_books_json(),
    }
    
    return render(request, 'HomePage-admin.html', context)

@login_required
def borrow_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    if book.stock > 0:
        # Create borrowed book record
        borrowed = BorrowedBook.objects.create(
            user=request.user,
            book=book
        )
        book.stock -= 1
        book.save()
        
        # Create notification for the user
        Notification.objects.create(
            recipient=request.user,
            title=f'Book Borrowed: {book.title}',
            message=f"You have successfully borrowed '{book.title}'. Please return it by {(timezone.now() + timedelta(days=14)).strftime('%Y-%m-%d')}",
            notification_type='book_borrowed',
            related_book=book
        )
        
        # Create notification for admins
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            Notification.objects.create(
                recipient=admin,
                title=f'Book Borrowed: {book.title}',
                message=f"User {request.user.username} has borrowed '{book.title}'",
                notification_type='book_borrowed',
                related_book=book
            )
        
        messages.success(request, f'You have successfully borrowed {book.title}')
        return redirect('home')
    else:
        messages.error(request, 'This book is currently out of stock')
        return redirect('home')

@login_required
def return_book(request, borrowed_id):
    borrowed = get_object_or_404(BorrowedBook, id=borrowed_id, user=request.user)
    if not borrowed.is_returned:
        borrowed.is_returned = True
        borrowed.return_date = timezone.now()
        borrowed.save()
        
        # Update book stock
        book = borrowed.book
        book.stock += 1
        book.save()
        
        # Create notification for the user
        Notification.send_book_notification(
            notification_type='book_returned',
            book=book,
            admin_user=None,
            message=f"You have successfully returned '{book.title}'. Thank you for using our library!"
        )
        
        # Create notification for admins
        admins = User.objects.filter(is_staff=True)
        for admin in admins:
            Notification.objects.create(
                recipient=admin,
                title=f'Book Returned: {book.title}',
                message=f"User {request.user.username} has returned '{book.title}'",
                notification_type='book_returned',
                related_book=book
            )
        
        messages.success(request, f'You have successfully returned {book.title}')
    return redirect('borrowed-list')

@login_required
@user_passes_test(is_admin)
def admin_book_detail(request, id):
    book = get_object_or_404(Book, id=id)
    
    # Get book reviews
    reviews = book.reviews.all().order_by('-created_at')
    
    # Get borrowing history
    borrow_history = BorrowedBook.objects.filter(book=book).order_by('-borrow_date')
    
    context = {
        'book': book,
        'reviews': reviews,
        'borrow_history': borrow_history,
        **get_notifications(request)
    }
    
    return render(request, 'books/book_detail.html', context)

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

@login_required
def add_favorite(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    user_profile = request.user.profile
    
    if book not in user_profile.favorite_books.all():
        user_profile.favorite_books.add(book)
        # Send notification for adding to favorites
        Notification.objects.create(
            recipient=request.user,
            title='Book Added to Favorites',
            message=f"'{book.title}' has been added to your favorites",
            notification_type='personal',
            related_book=book
        )
    
    return JsonResponse({
        'success': True,
        'message': 'Book added to favorites successfully'
    })

@login_required
def add_borrow(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    
    if book.stock > 0:
        # Create borrowed book record
        BorrowedBook.objects.create(
            user=request.user,
            book=book
        )
        book.stock -= 1
        book.save()
        
        # Send notification for borrowing book
        Notification.objects.create(
            recipient=request.user,
            title='Book Borrowed',
            message=f"'{book.title}' has been borrowed successfully",
            notification_type='personal',
            related_book=book
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Book borrowed successfully'
        })
    else:
        return JsonResponse({
            'success': False,
            'message': 'Book is out of stock'
        })

@login_required
def remove_favorite(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    user_profile = request.user.profile
    
    if book in user_profile.favorite_books.all():
        user_profile.favorite_books.remove(book)
        # Send notification for removing from favorites
        Notification.objects.create(
            recipient=request.user,
            title='Book Removed from Favorites',
            message=f"'{book.title}' has been removed from your favorites",
            notification_type='personal',
            related_book=book
        )
    
    return JsonResponse({
        'success': True,
        'message': 'Book removed from favorites successfully'
    })

@login_required
def return_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    borrowed = get_object_or_404(
        BorrowedBook,
        book=book,
        user=request.user,
        is_returned=False
    )
    
    borrowed.is_returned = True
    borrowed.return_date = timezone.now()
    borrowed.save()
    
    # Update book stock
    book.stock += 1
    book.save()
    
    # Send notification for returning book
    Notification.objects.create(
        recipient=request.user,
        title='Book Returned',
        message=f"'{book.title}' has been returned successfully",
        notification_type='personal',
        related_book=book
    )
    
    return JsonResponse({
        'success': True,
        'message': 'Book returned successfully'
    })

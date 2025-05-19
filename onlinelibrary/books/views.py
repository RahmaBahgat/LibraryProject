from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.core.serializers import serialize
import json
from .models import Book, BorrowedBook, Notification, User, Genre, BookReview
from .forms import BookForm
from django.urls import reverse
from django.utils import timezone
from .services import BookRecommendationService
from django.db.models import Q, Count
from django.core.exceptions import PermissionDenied

def get_notifications(request):
    """Helper function to get notifications for a user"""
    notifications = Notification.objects.filter(
        Q(recipient=request.user) | Q(recipient__isnull=True, notification_type='global')
    ).order_by('-created_at')[:5]
    return {'notifications': notifications}

def is_admin(user):
    return user.is_staff

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
    
    if request.method == 'POST':
        # Handle review submission
        rating = request.POST.get('rating')
        review_text = request.POST.get('review_text')
        
        if rating and review_text:
            if user_review:
                user_review.rating = rating
                user_review.review_text = review_text
                user_review.save()
            else:
                BookReview.objects.create(
                    book=book,
                    user=request.user,
                    rating=rating,
                    review_text=review_text
                )
            messages.success(request, 'Your review has been submitted!')
            return redirect('book_detail', id=id)
    
    # Load book cover paths from data.js if available
    try:
        import os
        import re
        from django.conf import settings
        
        # Path to the data.js file
        data_js_path = os.path.join(settings.BASE_DIR, 'Static', 'js', 'data.js')
        
        if os.path.exists(data_js_path):
            with open(data_js_path, 'r', encoding='utf-8') as file:
                content = file.read()
                # Extract book title and cover path using regex
                pattern = r'title:\s*"([^"]+)".*?cover:\s*"([^"]+)"'
                matches = re.findall(pattern, content, re.DOTALL)
                
                for title, cover_path in matches:
                    if book.title == title:
                        # Convert relative path to static path format
                        static_path = cover_path.replace('../', '')
                        book.cover_path = static_path
                        break
    except Exception as e:
        print(f"Error loading book cover path: {str(e)}")
    
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
    all_books = Book.objects.all()
    
    # Get books by badge
    new_releases = all_books.filter(badge='new-release')[:10]
    trending_books = all_books.filter(badge='trending')[:10]
    bestsellers = all_books.filter(badge='bestseller')[:10]
    coming_soon = all_books.filter(badge='coming-soon')[:10]
    
    # Get books by rating
    highly_rated = all_books.filter(average_rating__gte=4.5).order_by('-average_rating')[:10]
    
    # Get books by genre - Updated to use genres field
    fiction_books = all_books.filter(genres__name='Fiction').distinct()[:10]
    fantasy_books = all_books.filter(genres__name='Fantasy').distinct()[:10]
    thriller_books = all_books.filter(genres__name='Thriller').distinct()[:10]
    
    # Library stats
    total_books = all_books.count()
    borrowed_count = BorrowedBook.objects.filter(return_date__isnull=True).count()
    total_users = User.objects.filter(is_staff=False).count()
    recent_additions = all_books.order_by('-created_at')[:5]
    
    # Get recent activity
    recent_borrows = BorrowedBook.objects.filter(is_returned=False).order_by('-borrow_date')[:5]
    recent_returns = BorrowedBook.objects.filter(is_returned=True).order_by('-return_date')[:5]
    
    # Get notifications for admin
    notifications = Notification.objects.filter(
        Q(recipient=request.user) | Q(recipient__isnull=True, notification_type='global')
    ).order_by('-created_at')[:10]
    
    # Load book cover paths from data.js
    try:
        import os
        import re
        from django.conf import settings
        
        # Path to the data.js file
        data_js_path = os.path.join(settings.BASE_DIR, 'Static', 'js', 'data.js')
        
        if os.path.exists(data_js_path):
            with open(data_js_path, 'r', encoding='utf-8') as file:
                content = file.read()
                # Extract book titles and cover paths using regex
                pattern = r'title:\s*"([^"]+)".*?cover:\s*"([^"]+)"'
                matches = re.findall(pattern, content, re.DOTALL)
                
                # Process all book lists
                book_lists = [
                    new_releases, trending_books, bestsellers, coming_soon, 
                    highly_rated, fiction_books, fantasy_books, thriller_books, 
                    recent_additions, all_books[:20]
                ]
                
                # Add cover paths to all books
                for book_list in book_lists:
                    if book_list:
                        for book in book_list:
                            # Try to find a matching cover path
                            for title, cover_path in matches:
                                if book.title.strip() == title.strip():
                                    # Convert relative path to static path format
                                    static_path = cover_path.replace('../', '')
                                    # Remove any leading slashes to make it relative to static root
                                    static_path = static_path.lstrip('/')
                                    book.cover_path = static_path
                                    break
    except Exception as e:
        print(f"Error loading book cover paths: {str(e)}")
    
    context = {
        'total_books': total_books,
        'borrowed_count': borrowed_count,
        'total_users': total_users,
        'recent_additions': recent_additions,
        'recent_borrows': recent_borrows,
        'recent_returns': recent_returns,
        'new_releases': new_releases,
        'trending_books': trending_books,
        'bestsellers': bestsellers,
        'coming_soon': coming_soon,
        'highly_rated': highly_rated,
        'fiction_books': fiction_books,
        'fantasy_books': fantasy_books,
        'thriller_books': thriller_books,
        'all_books': all_books[:20],  # Limit to first 20 books for performance
        'notifications': notifications,
    }
    
    return render(request, 'HomePage-admin.html', context)

@login_required
@user_passes_test(is_admin)
def list_books(request):
    books = Book.objects.all()
    print("Loading book cover paths...")

    # Load book cover paths from data.js
    try:
        import os
        import re
        from django.conf import settings
        
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
                        
                        if book_title in cover_paths:
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
            print(f"Images directory not found: {images_dir}")
            for book in books:
                book.cover_path = 'images/books/default-cover.jpg'
                
    except Exception as e:
        print(f"Error loading book cover paths: {str(e)}")
        # Ensure all books have a default cover path
        for book in books:
            if not hasattr(book, 'cover_path'):
                book.cover_path = 'images/books/default-cover.jpg'

    context = {
        'books': books,
    }
    return render(request, 'books/book_list.html', context)

@login_required
@user_passes_test(is_admin)
def add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            book = form.save()
            # Create notifications for all admins
            for admin in User.objects.filter(is_staff=True):
                Notification.objects.create(
                    recipient=admin,
                    title=f'Book Added: {book.title}',
                    message=f"Admin {request.user.username} has added the book '{book.title}' to the library",
                    notification_type='book_added',
                    related_book=book
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
            # Create notifications for all admins
            for admin in User.objects.filter(is_staff=True):
                Notification.objects.create(
                    recipient=admin,
                    title=f'Book Updated: {book.title}',
                    message=f"Admin {request.user.username} has updated the book '{book.title}'",
                    notification_type='book_edited',
                    related_book=book
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
    title = book.title
    book.delete()
    # Create notifications for all admins
    for admin in User.objects.filter(is_staff=True):
        Notification.objects.create(
            recipient=admin,
            title=f'Book Removed: {title}',
            message=f"Admin {request.user.username} has removed the book '{title}' from the library",
            notification_type='book_removed'
        )
    messages.success(request, 'Book deleted successfully!')
    return redirect('books_admin:admin_book_management')

@login_required
@user_passes_test(is_admin)
def api_list_books(request):
    books = Book.objects.all().order_by('-created_at')
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
    # Get all books
    all_books = Book.objects.all()
    
    # Get user's borrowed books
    borrowed_books = BorrowedBook.objects.filter(user=request.user, is_returned=False)
    
    # Get books by badge
    new_releases = Book.objects.filter(badge='new').order_by('-created_at')[:10]
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
    favorite_genres = []
    
    # Calculate favorite genres based on user's history
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
        import os
        import re
        from django.conf import settings
        
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
    
    context = {
        'user': request.user,
        'borrowed_books': borrowed_books,
        'new_releases': new_releases,
        'trending_books': trending_books,
        'bestsellers': bestsellers,
        'highly_rated_books': highly_rated_books,
        'recommended_books': recommended_books,
        'similar_books': similar_books,
        'notifications': notifications,
        # User stats
        'total_borrowed': total_borrowed,
        'currently_borrowed': currently_borrowed,
        'favorite_genres': favorite_genres,
    }
    
    return render(request, 'HomePage-user.html', context)

@login_required
@user_passes_test(is_admin)
def home_admin(request):
    # Get all books
    all_books = Book.objects.all()

    # Get recent books (most recently added books)
    recent_books = Book.objects.all().order_by('-created_at')[:10]

    # Get new releases (books added in the last 30 days)
    new_releases = Book.objects.filter(created_at__gte=timezone.now() - timezone.timedelta(days=30))

    # Get trending books (most borrowed recently)
    trending_books = Book.objects.filter(badge='trending')[:10]

    # Get bestsellers
    bestsellers = Book.objects.filter(badge='bestseller')[:10]

    # Get highly rated books
    highly_rated = Book.objects.filter(average_rating__gte=4.0).order_by('-average_rating')[:10]

    # Get statistics
    total_books = Book.objects.count()
    borrowed_count = BorrowedBook.objects.filter(is_returned=False).count()
    total_users = User.objects.count()
    total_reviews = BookReview.objects.count()  # Added total reviews count

    # Load book cover paths from data.js
    try:
        import os
        import re
        from django.conf import settings
        
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
        'recent_books': recent_books,  # Added recent books to context
        'new_releases': new_releases,
        'trending_books': trending_books,
        'bestsellers': bestsellers,
        'highly_rated': highly_rated,
        'total_books': total_books,
        'borrowed_count': borrowed_count,
        'total_users': total_users,
        'total_reviews': total_reviews,  # Added total reviews to context
        'notifications': Notification.objects.filter(recipient=request.user).order_by('-created_at')[:5]
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
            message=f"You have successfully borrowed '{book.title}'",
            notification_type='book_borrowed',
            related_book=book
        )
        
        # Create notification for admins
        for admin in User.objects.filter(is_staff=True):
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
        Notification.objects.create(
            recipient=request.user,
            title=f'Book Returned: {book.title}',
            message=f"You have successfully returned '{book.title}'",
            notification_type='book_returned',
            related_book=book
        )
        
        # Create notification for admins
        for admin in User.objects.filter(is_staff=True):
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
    
    # Load book cover path from data.js if available
    try:
        import os
        import re
        from django.conf import settings
        
        # Path to the data.js file
        data_js_path = os.path.join(settings.BASE_DIR, 'Static', 'js', 'data.js')
        
        if os.path.exists(data_js_path):
            with open(data_js_path, 'r', encoding='utf-8') as file:
                content = file.read()
                # Extract book title and cover path using regex
                pattern = r'title:\s*"([^"]+)".*?cover:\s*"([^"]+)"'
                matches = re.findall(pattern, content, re.DOTALL)
                
                for title, cover_path in matches:
                    if book.title == title:
                        # Convert relative path to static path format
                        static_path = cover_path.replace('../', '')
                        book.cover_path = static_path
                        break
    except Exception as e:
        print(f"Error loading book cover path: {str(e)}")
    
    context = {
        'book': book,
        'reviews': reviews,
        'borrow_history': borrow_history,
        'notifications': Notification.objects.filter(recipient=request.user).order_by('-created_at')[:5]
    }
    
    return render(request, 'books/book_detail.html', context)

@login_required
def toggle_favorite(request, book_id):
    if request.method == 'POST':
        book = get_object_or_404(Book, id=book_id)
        profile = request.user.profile
        
        if profile.favorite_books.filter(id=book_id).exists():
            profile.favorite_books.remove(book)
            is_favorite = False
        else:
            profile.favorite_books.add(book)
            is_favorite = True
            
        return JsonResponse({
            'success': True,
            'is_favorite': is_favorite
        })
    return JsonResponse({'success': False}, status=400)

@login_required
def favorites(request):
    user_favorites = request.user.profile.favorite_books.all()
    context = {
        'favorite_books': user_favorites,
        **get_notifications(request)
    }
    return render(request, 'FavouriteBooks.html', context)

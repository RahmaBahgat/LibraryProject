from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from books.models import Notification, Book, BorrowedBook, UserProfile, BookReview
from django.http import JsonResponse, HttpResponseBadRequest
from django.middleware.csrf import get_token
from django.db.models import Q, Avg
from django.contrib.admin.views.decorators import staff_member_required
from django.utils import timezone
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

# Public Pages
def home(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('admin_home')
        context = {**get_notifications(request)}
        return render(request, 'HomePage-user.html', context)
    return redirect('login')

def about(request):
    context = {**get_notifications(request)}
    return render(request, 'about.html', context)

def privacy(request):
    context = {**get_notifications(request)}
    return render(request, 'privacy.html', context)

def help(request):
    context = {**get_notifications(request)}
    return render(request, 'help.html', context)  # Make sure help.html exists in templates/

def terms(request):
    return render(request, 'terms.html')

def faq(request):
    context = {**get_notifications(request)}
    return render(request, 'faq.html', context)

# Book Pages
def book_list(request):
    context = {**get_notifications(request)}
    return render(request, 'bookPage.html', context)

def book_detail(request, book_id):
    context = {**get_notifications(request)}
    return render(request, 'bookPage.html', context)

def book_admin(request):
    context = {**get_notifications(request)}
    return render(request, 'book page admin.html', context)

# User Pages
@login_required
def profile(request):
    # Get or create the user's profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    context = {
        'profile': profile,
        **get_notifications(request)
    }
    return render(request, 'profile.html', context)

@login_required
def favorites(request):
    user_favorites = request.user.profile.favorite_books.all()
    context = {
        'favorite_books': user_favorites,
        **get_notifications(request)
    }
    return render(request, 'FavouriteBooks.html', context)

@login_required
def borrowed_list(request):
    context = {**get_notifications(request)}
    return render(request, 'borrowed-list.html', context)

# Auth Pages
@ensure_csrf_cookie
def login_page(request):
    # If user is already authenticated, redirect them
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        # Ensure we have the required fields
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if not username or not password:
            error_message = 'Please provide both username and password.'
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': [error_message]}, status=400)
            messages.error(request, error_message)
            return render(request, 'LogIn_SignUp page.html')

        # Attempt to authenticate
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            # Create login notification
            Notification.objects.create(
                recipient=user,
                title='Welcome Back!',
                message=f'You have successfully logged in to your account.',
                notification_type='system'
            )
            
            redirect_url = 'admin_home' if user.is_staff else 'home'
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'redirect_url': redirect(redirect_url).url
                })
            return redirect(redirect_url)
        else:
            error_message = 'Invalid username or password.'
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'errors': [error_message]
                }, status=400)
            messages.error(request, error_message)
            return render(request, 'LogIn_SignUp page.html')
    
    # For GET requests, just render the page with a fresh CSRF token
    response = render(request, 'LogIn_SignUp page.html')
    # Ensure CSRF token is set in cookie
    get_token(request)
    return response

@ensure_csrf_cookie
def signup_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        email = request.POST.get('email')
        role = request.POST.get('role')
        accept_terms = request.POST.get('accept_terms')

        errors = []
        
        # Validate passwords match
        if password != confirm_password:
            errors.append('Passwords do not match.')

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            errors.append('Username already exists.')

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            errors.append('Email already exists.')

        # Validate terms acceptance
        if not accept_terms:
            errors.append('You must accept the Terms of Service and Privacy Policy.')

        if errors:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'errors': errors
                })
            for error in errors:
                messages.error(request, error)
            return render(request, 'LogIn_SignUp page.html')

        try:
            # Create the user
            user = User.objects.create_user(username=username, email=email, password=password)
            
            # Set staff status based on role selection
            if role == 'admin':
                user.is_staff = True
                user.save()
            
            # Create welcome notification for new user
            Notification.objects.create(
                recipient=user,
                title='Welcome to InOtherWords Library!',
                message='Thank you for joining our community. Start exploring our collection of books today!',
                notification_type='system'
            )
            
            # Notify admins about new user registration
            if not user.is_staff:  # Don't notify about admin registrations
                admins = User.objects.filter(is_staff=True)
                for admin in admins:
                    Notification.objects.create(
                        recipient=admin,
                        title='New User Registration',
                        message=f'New user {username} has joined InOtherWords Library.',
                        notification_type='system'
                    )
            
            # Log the user in
            login(request, user)
            
            # Determine redirect URL based on role
            redirect_url = 'admin_home' if user.is_staff else 'home'
            success_message = 'Welcome! ' + ('You have been registered as an administrator.' if user.is_staff else 'Your account has been created successfully.')
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'redirect_url': redirect(redirect_url).url,
                    'message': success_message
                })
            
            messages.success(request, success_message)
            return redirect(redirect_url)

        except Exception as e:
            error_message = 'An error occurred during registration. Please try again.'
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'errors': [error_message]
                })
            messages.error(request, error_message)
            return render(request, 'LogIn_SignUp page.html')
    
    return render(request, 'LogIn_SignUp page.html')

def logout_page(request):
    logout(request)
    return redirect('index')

@login_required
def notifications(request):
    return render(request, 'notifications.html')

@login_required
def admin_notifications(request):
    return render(request, 'notifications-admin.html')

def index(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('admin_home')
        return redirect('home')
    
    # Get trending books (books with highest average rating)
    trending_books = Book.objects.filter(
        average_rating__isnull=False
    ).order_by('-average_rating')[:8]  # Get top 8 rated books

    # Add rating stars for each book
    for book in trending_books:
        rating = book.average_rating or 0
        full_stars = '★' * int(rating)
        half_star = '½' if rating % 1 >= 0.5 else ''
        empty_stars = '☆' * (5 - int(rating) - (1 if half_star else 0))
        book.rating_stars = f"{full_stars}{half_star}{empty_stars}"

    return render(request, 'index.html', {'trending_books': trending_books})

@staff_member_required
def admin_home(request):
    # Get statistics
    total_books = Book.objects.count()
    borrowed_count = BorrowedBook.objects.filter(is_returned=False).count()
    total_users = User.objects.count()
    total_reviews = BookReview.objects.count()
    
    # Get book lists
    recent_additions = Book.objects.all().order_by('-created_at')[:10]
    highly_rated = Book.objects.filter(average_rating__gte=4.0).order_by('-average_rating')[:10]
    
    context = {
        'user': request.user,
        'total_books': total_books,
        'total_borrowed': borrowed_count,
        'total_users': total_users,
        'total_reviews': total_reviews,
        'recent_additions': recent_additions,
        'highly_rated': highly_rated,
        **get_notifications(request)
    }
    return render(request, 'HomePage-admin.html', context)

@login_required
def profile_view(request):
    return render(request, 'Profile.html', {
        'user': request.user,
        'profile': request.user.profile,
    })

def borrowed_list(request):
    return render(request, 'borrowed_list.html')

@login_required
def update_profile_picture(request):
    try:
        if request.method == 'POST' and request.FILES.get('profile_picture'):
            # Get or create profile
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            
            if profile.profile_picture:
                # Delete old profile picture file
                profile.profile_picture.delete()
            
            profile.profile_picture = request.FILES['profile_picture']
            profile.save()
            
        return redirect('profile')
    except Exception as e:
        messages.error(request, f'Error updating profile picture: {str(e)}')
        return redirect('profile')

@ensure_csrf_cookie
def check_auth(request):
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
    return JsonResponse({
        'is_authenticated': request.user.is_authenticated,
        'is_staff': request.user.is_staff if request.user.is_authenticated else False,
        'is_superuser': request.user.is_superuser if request.user.is_authenticated else False
    })

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from books.models import Notification, Book, BorrowedBook, UserProfile
from django.http import JsonResponse, HttpResponseBadRequest
from django.middleware.csrf import get_token
from django.db.models import Q

def get_notifications(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return {
                'admin_notifications': Notification.objects.filter(notification_type='admin').order_by('-created_at')[:5]
            }
        else:
            return {
                'user_notifications': Notification.objects.filter(recipient=request.user).order_by('-created_at')[:5]
            }
    return {}

# Public Pages
def home(request):
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('/library-admin/books/')
    context = {**get_notifications(request)}
    return render(request, 'HomePage-user.html', context)

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
    context = {**get_notifications(request)}
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
            redirect_url = '/library-admin/books/' if user.is_staff else '/home/'
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'redirect_url': redirect_url
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
            
            # Log the user in
            login(request, user)
            
            # Determine redirect URL based on role
            redirect_url = '/library-admin/books/' if user.is_staff else '/home/'
            success_message = 'Welcome! ' + ('You have been registered as an administrator.' if user.is_staff else 'Your account has been created successfully.')
            
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'redirect_url': redirect_url,
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
    return render(request, 'index.html')

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

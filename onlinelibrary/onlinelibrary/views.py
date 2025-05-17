from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from books.models import Notification

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
    context = {**get_notifications(request)}
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
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            if user.is_staff:
                return redirect('/library-admin/books/')
            else:
                return redirect('home')  # Redirect regular users to user home page
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'LogIn_SignUp page.html')

@ensure_csrf_cookie
def signup_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        email = request.POST.get('email')
        role = request.POST.get('role')
        accept_terms = request.POST.get('accept_terms')

        try:
            # Validate passwords match
            if password != confirm_password:
                messages.error(request, 'Passwords do not match.')
                return render(request, 'LogIn_SignUp page.html')

            # Check if username already exists
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username already exists.')
                return render(request, 'LogIn_SignUp page.html')

            # Check if email already exists
            if User.objects.filter(email=email).exists():
                messages.error(request, 'Email already exists.')
                return render(request, 'LogIn_SignUp page.html')

            # Validate terms acceptance
            if not accept_terms:
                messages.error(request, 'You must accept the Terms of Service and Privacy Policy.')
                return render(request, 'LogIn_SignUp page.html')

            # Create the user
            user = User.objects.create_user(username=username, email=email, password=password)
            
            # Set staff status based on role selection
            if role == 'admin':
                user.is_staff = True
                user.save()
            
            # Log the user in
            login(request, user)
            
            # Redirect based on role
            if user.is_staff:
                messages.success(request, 'Welcome! You have been registered as an administrator.')
                return redirect('/library-admin/books/')
            else:
                messages.success(request, 'Welcome! Your account has been created successfully.')
                return redirect('home')

        except Exception as e:
            messages.error(request, 'An error occurred during registration. Please try again.')
            return render(request, 'LogIn_SignUp page.html')
    
    return render(request, 'LogIn_SignUp page.html')

def logout_page(request):
    logout(request)
    return redirect('index')

# Admin Pages
@login_required
def admin_home(request):
    return render(request, 'HomePage-admin.html')

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
    

<<<<<<< HEAD
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
=======
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

>>>>>>> 71663c7f2fd49d11ccbee77b51a79d254450c2fa

# Public Pages
def home(request):
    return render(request, 'HomePage-user.html')

def about(request):
    return render(request, 'about.html')

def privacy(request):
    return render(request, 'privacy.html')

def help(request):
    return render(request, 'help.html')  # Make sure help.html exists in templates/

# Book Pages
def book_list(request):
    return render(request, 'bookPage.html')

def book_detail(request, book_id):
    return render(request, 'bookPage.html')

def book_admin(request):
    return render(request, 'book page admin.html')

# User Pages
@login_required
def profile(request):
    return render(request, 'profile.html')

@login_required
def favorites(request):
    return render(request, 'FavouriteBooks.html')

def borrowed_list(request):
    return render(request, 'borrowed-list.html')

# Auth Pages
def login_page(request):
<<<<<<< HEAD
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            if user.is_staff:
                return redirect('/library-admin/books/')
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'LogIn_SignUp page.html')
=======
    return render(request, 'accounts/login.html')
>>>>>>> 71663c7f2fd49d11ccbee77b51a79d254450c2fa

def signup_page(request):
    return render(request, 'accounts/signup.html')

# Admin Pages
def admin_home(request):
    return render(request, 'HomePage-admin.html')

def notifications(request):
    return render(request, 'notifications.html')

def admin_notifications(request):
    return render(request, 'notifications-admin.html')
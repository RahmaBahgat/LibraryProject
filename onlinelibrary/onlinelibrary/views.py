from django.shortcuts import render

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
def profile(request):
    return render(request, 'profile.html')

def favorites(request):
    return render(request, 'FavouriteBooks.html')

def borrowed_list(request):
    return render(request, 'borrowed-list.html')

# Auth Pages
def login_page(request):
    return render(request, 'LogIn_SignUp page.html')

def signup_page(request):
    return render(request, 'LogIn_SignUp page.html')

def login_signup(request):
    return render(request, 'LogIn_SignUp page.html')

# Admin Pages
def admin_home(request):
    return render(request, 'HomePage-admin.html')

def notifications(request):
    return render(request, 'notifications.html')

def admin_notifications(request):
    return render(request, 'notifications-admin.html')
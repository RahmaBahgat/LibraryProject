"""
URL configuration for onlinelibrary project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls), 
]
from django.urls import path
from . import views

urlpatterns = [
    # Public Pages
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('privacy/', views.privacy, name='privacy'),
    path('help/', views.help, name='help'),
    
    # Book Pages
    path('books/', views.book_list, name='book-list'),
    path('books/<int:book_id>/', views.book_detail, name='book-detail'),
    path('books/admin/', views.book_admin, name='book-admin'),
    
    # User Pages
    path('profile/', views.profile, name='profile'),
    path('favorites/', views.favorites, name='favorites'),
    path('borrowed/', views.borrowed_list, name='borrowed-list'),
    
    # Auth Pages
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),
    path('login-signup/', views.login_signup, name='login-signup'),
    
    # Admin Pages
    path('admin/home/', views.admin_home, name='admin-home'),
    path('notifications/', views.notifications, name='notifications'),
    path('admin/notifications/', views.admin_notifications, name='admin-notifications'),
]
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
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from books.views_notifications import user_notifications, admin_notifications, mark_notification_read

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # Public Pages
    path('', views.index, name='index'),
    path('home/', views.home, name='home'),  # User home page
    path('about/', views.about, name='about'),
    path('privacy/', views.privacy, name='privacy'),
    path('help/', include('help.urls')),

    # Book Pages
    path('library-admin/books/', include('books.urls')),
    
    # User Pages
    path('profile/', views.profile, name='profile'),
    path('favorites/', views.favorites, name='favorites'),
    path('borrowed/', views.borrowed_list, name='borrowed-list'),
    
    # Auth Pages
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),
    path('logout/', views.logout_page, name='logout'),
    
    # Admin Pages
    path('library-admin/', views.admin_home, name='admin-home'),
    
    # Notification Pages
    path('notifications/', user_notifications, name='notifications'),
    path('library-admin/notifications/', admin_notifications, name='admin-notifications'),
    path('notifications/<int:notification_id>/mark-read/', mark_notification_read, name='mark-notification-read'),
    #profile pages
    path('profile/', views.profile, name='profile'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

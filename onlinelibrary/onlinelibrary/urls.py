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
from books.views import home_user, home_admin, book_detail, borrow_book, api_featured_books, api_book_categories, toggle_favorite

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # Public Pages
    path('', views.index, name='index'),
    path('home/', home_user, name='home'),  # User home page
    path('about/', views.about, name='about'),
    path('privacy/', views.privacy, name='privacy'),
    path('terms/', views.terms, name='terms'),
    path('faq/', views.faq, name='faq'),
    path('help/', include('help.urls')),  # Include help app URLs

    # Book Pages
    path('library-admin/books/', include('books.urls')),
    path('book/<int:id>/', book_detail, name='book_detail'),  # Book detail page
    path('book/<int:book_id>/toggle-favorite/', toggle_favorite, name='toggle_favorite'),
    
    # User Pages
    path('profile/', views.profile, name='profile'),
    path('favorites/', views.favorites, name='favorites'),
    path('borrowed/', views.borrowed_list, name='borrowed-list'),
    
    # Auth Pages
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),
    path('logout/', views.logout_page, name='logout'),
    
    # Admin Pages
    path('admin-home/', views.admin_home, name='admin_home'),
    path('library-admin/', home_admin, name='admin-home'),
    
    # Notification Pages
    path('notifications/', user_notifications, name='notifications'),
    path('notifications/get-latest/', user_notifications, {'get_latest': True}, name='get-latest-notifications'),
    path('library-admin/notifications/', admin_notifications, name='admin-notifications'),
    path('notifications/<int:notification_id>/mark-read/', mark_notification_read, name='mark-notification-read'),
    
    # Profile pages
    path('profile/', views.profile, name='profile'),
    path('profile/update-picture/', views.update_profile_picture, name='update_profile_picture'),
    
    # Book actions
    path('book/<int:book_id>/borrow/', borrow_book, name='borrow_book'),
    
    # API endpoints
    path('api/books/featured/', api_featured_books, name='api_featured_books'),
    path('api/books/categories/', api_book_categories, name='api_book_categories'),
    path('check-auth/', views.check_auth, name='check_auth'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

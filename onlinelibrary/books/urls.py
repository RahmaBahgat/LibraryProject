from django.urls import path
from . import views

app_name = 'books_admin'  # Changed from 'books' to 'books_admin' to match your template

urlpatterns = [
    path('', views.admin_book_management, name='admin_book_management'),  # Changed to be the main admin view
    path('user/', views.home_user, name='home_user'),  # User home page
    path('list/', views.list_books, name='list_books'),
    path('add/', views.add_book, name='add_book'),
    path('edit/<int:id>/', views.edit_book, name='edit_book'),
    path('delete/<int:id>/', views.delete_book, name='delete_book'),
    path('book/<int:id>/', views.admin_book_detail, name='book_detail'),
    path('book/<int:book_id>/toggle-favorite/', views.toggle_favorite, name='toggle_favorite'),
    path('api/list/', views.api_list_books, name='api_list_books'),
    path('api/featured/', views.api_featured_books, name='api_featured_books'),
    path('api/categories/', views.api_book_categories, name='api_book_categories'),
]
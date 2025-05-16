from django.urls import path
from . import views

app_name = 'books_admin'  # Changed from 'books' to 'books_admin' to match your template

urlpatterns = [
    path('', views.admin_dashboard, name='admin_dashboard'),  # Main admin dashboard
    path('books/', views.admin_book_management, name='admin_book_management'),  # Book management page
    path('user/', views.home_user, name='home_user'),  # User home page
    path('list/', views.list_books, name='list_books'),
    path('add/', views.add_book, name='add_book'),
    path('edit/<int:id>/', views.edit_book, name='edit_book'),
    path('delete/<int:id>/', views.delete_book, name='delete_book'),
    path('api/list/', views.api_list_books, name='api_list_books'),
    path('book/<int:id>/', views.book_detail, name='book_detail'),
]
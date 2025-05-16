from django.contrib import admin
from .models import Book, Notification, BorrowedBook

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'isbn', 'price', 'stock', 'created_at')
    search_fields = ('title', 'author', 'isbn')
    list_filter = ('created_at',)
    ordering = ('-created_at',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'notification_type', 'recipient', 'sender', 'created_at', 'is_read')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'recipient__username', 'sender__username')
    ordering = ('-created_at',)

@admin.register(BorrowedBook)
class BorrowedBookAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'borrow_date', 'return_date', 'is_returned')
    list_filter = ('is_returned', 'borrow_date')
    search_fields = ('user__username', 'book__title')
    ordering = ('-borrow_date',)

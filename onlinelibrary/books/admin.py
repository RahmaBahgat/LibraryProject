from django.contrib import admin
from .models import Book, Notification

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'isbn', 'price', 'stock', 'created_at')
    search_fields = ('title', 'author', 'isbn')
    list_filter = ('created_at',)
    ordering = ('-created_at',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__username', 'message')
    ordering = ('-created_at',)

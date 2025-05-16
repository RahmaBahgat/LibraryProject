from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from django.utils import timezone

class Book(models.Model):
    BADGE_CHOICES = [
        ('new', 'New Release'),
        ('trending', 'Trending'),
        ('bestseller', 'Bestseller'),
        ('sale', 'On Sale'),
    ]

    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    description = models.TextField()
    isbn = models.CharField(max_length=13, unique=True, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='books/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    badge = models.CharField(max_length=20, choices=BADGE_CHOICES, null=True, blank=True)

    def __str__(self):
        return self.title

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'isbn': self.isbn,
            'price': str(self.price),  # Convert Decimal to string
            'stock': self.stock,
            'image': self.image.url if self.image else None,
            'created_at': self.created_at.isoformat(),
            'badge': self.badge,
        }

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

class BorrowedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"

    class Meta:
        ordering = ['-borrow_date']
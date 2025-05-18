from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from django.utils import timezone
from django.db.models import Avg

class Genre(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

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
    genres = models.ManyToManyField(Genre, related_name='books')
    total_borrows = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.title

    def update_average_rating(self):
        avg_rating = self.reviews.aggregate(Avg('rating'))['rating__avg']
        self.average_rating = avg_rating if avg_rating else 0.0
        self.save()

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'isbn': self.isbn,
            'price': str(self.price),
            'stock': self.stock,
            'image': self.image.url if self.image else None,
            'created_at': self.created_at.isoformat(),
            'badge': self.badge,
            'average_rating': self.average_rating,
            'genres': [genre.name for genre in self.genres.all()],
        }

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    favorite_genres = models.ManyToManyField(Genre, blank=True)
    favorite_books = models.ManyToManyField(Book, blank=True, related_name='favorited_by')
    
    def get_reading_preferences(self):
        borrowed_books = BorrowedBook.objects.filter(user=self.user)
        favorite_authors = borrowed_books.values('book__author').annotate(
            count=models.Count('book__author')
        ).order_by('-count')[:5]
        return {
            'favorite_genres': list(self.favorite_genres.values_list('name', flat=True)),
            'favorite_authors': [item['book__author'] for item in favorite_authors]
        }

class BookReview(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('book', 'user')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.book.update_average_rating()

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('personal', 'Personal'),
        ('global', 'Global'),
        ('system', 'System'),
        ('book_added', 'Book Added'),
        ('book_edited', 'Book Edited'),
        ('book_removed', 'Book Removed'),
        ('book_borrowed', 'Book Borrowed'),
        ('book_returned', 'Book Returned'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications_received', null=True, blank=True)
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='notifications_sent', null=True, blank=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    related_book = models.ForeignKey('Book', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type}: {self.title}"

    @classmethod
    def send_personal_notification(cls, sender, recipient, title, message):
        return cls.objects.create(
            sender=sender,
            recipient=recipient,
            title=title,
            message=message,
            notification_type='personal'
        )

    @classmethod
    def send_global_notification(cls, sender, title, message):
        return cls.objects.create(
            sender=sender,
            title=title,
            message=message,
            notification_type='global'
        )

    @classmethod
    def send_system_notification(cls, title, message, recipient=None):
        return cls.objects.create(
            recipient=recipient,
            title=title,
            message=message,
            notification_type='system'
        )

    @classmethod
    def send_book_notification(cls, notification_type, book, admin_user, message=None):
        """Send book-related notifications to admin and create system notification"""
        title_map = {
            'book_added': f'Book Added: {book.title}',
            'book_edited': f'Book Updated: {book.title}',
            'book_removed': f'Book Removed: {book.title}',
            'book_borrowed': f'Book Borrowed: {book.title}',
            'book_returned': f'Book Returned: {book.title}',
        }
        
        # Create admin notification
        if admin_user and notification_type in ['book_added', 'book_edited', 'book_removed']:
            cls.objects.create(
                recipient=admin_user,
                title=title_map[notification_type],
                message=message or f"You have {notification_type.replace('_', ' ')} the book '{book.title}'",
                notification_type=notification_type,
                related_book=book if notification_type != 'book_removed' else None
            )

        # Create system notification for borrowing/returning
        if notification_type in ['book_borrowed', 'book_returned']:
            cls.objects.create(
                recipient=admin_user,
                title=title_map[notification_type],
                message=message or f"The book '{book.title}' has been {notification_type.replace('book_', '')}",
                notification_type=notification_type,
                related_book=book
            )

class BorrowedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"

    def save(self, *args, **kwargs):
        if not self.pk:  # If this is a new borrow
            self.book.total_borrows += 1
            self.book.save()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-borrow_date']
from django.db.models import Count, Q, F
from django.utils import timezone
from datetime import timedelta
from .models import Book, BorrowedBook, Review, Genre

class BookRecommendationService:
    def __init__(self, user):
        self.user = user

    def get_recommendations(self, limit=10):
        """Get personalized book recommendations for the user"""
        if not self.user.is_authenticated:
            return Book.objects.all().order_by('-average_rating')[:limit]

        # Get user's borrowed books
        borrowed_books = BorrowedBook.objects.filter(user=self.user)
        
        if not borrowed_books.exists():
            # If user hasn't borrowed any books, return highly rated books
            return Book.objects.filter(average_rating__gte=4.0).order_by('-average_rating')[:limit]

        # Get genres of borrowed books
        borrowed_genres = Genre.objects.filter(books__in=borrowed_books.values('book'))
        
        # Get books with similar genres
        recommended_books = Book.objects.filter(
            genres__in=borrowed_genres
        ).exclude(
            id__in=borrowed_books.values('book')
        ).annotate(
            genre_count=Count('genres', filter=Q(genres__in=borrowed_genres))
        ).order_by('-genre_count', '-average_rating')[:limit]

        return recommended_books

    def get_similar_books(self, book, limit=5):
        """Get books similar to the given book"""
        if not book:
            return []

        # Get books with similar genres
        similar_books = Book.objects.filter(
            genres__in=book.genres.all()
        ).exclude(
            id=book.id
        ).annotate(
            genre_count=Count('genres', filter=Q(genres__in=book.genres.all()))
        ).order_by('-genre_count', '-average_rating')[:limit]

        return similar_books

    def get_trending_books(self, days=7, limit=5):
        """Get trending books based on recent borrows"""
        period_start = timezone.now() - timedelta(days=days)
        return Book.objects.filter(
            borrowedbook__borrow_date__gte=period_start
        ).annotate(
            recent_borrows=Count('borrowedbook')
        ).order_by('-recent_borrows')[:limit]

    def get_new_releases(self, days=30, limit=5):
        """Get newly added books"""
        period_start = timezone.now() - timedelta(days=days)
        return Book.objects.filter(
            created_at__gte=period_start
        ).order_by('-created_at')[:limit] 
from django.db.models import Count, Q, F
from django.utils import timezone
from datetime import timedelta
from .models import Book, BorrowedBook, BookReview, Genre

class BookRecommendationService:
    def __init__(self, user):
        self.user = user

    def get_recommendations(self, limit=10):
        """Get personalized book recommendations for the user"""
        recommendations = []
        
        # Get user's reading preferences
        if hasattr(self.user, 'profile'):
            favorite_genres = self.user.profile.favorite_genres.all()
            borrowed_books = BorrowedBook.objects.filter(user=self.user).values_list('book_id', flat=True)
            
            # Books in user's favorite genres they haven't borrowed
            genre_recommendations = Book.objects.filter(
                genres__in=favorite_genres
            ).exclude(
                id__in=borrowed_books
            ).distinct()
            recommendations.extend(genre_recommendations[:5])

            # Books by authors they've read before
            author_recommendations = Book.objects.filter(
                author__in=BorrowedBook.objects.filter(
                    user=self.user
                ).values_list('book__author', flat=True)
            ).exclude(
                id__in=borrowed_books
            ).distinct()
            recommendations.extend(author_recommendations[:5])

        # Popular books in the last 30 days
        month_ago = timezone.now() - timedelta(days=30)
        popular_books = Book.objects.filter(
            borrowedbook__borrow_date__gte=month_ago
        ).annotate(
            borrow_count=Count('borrowedbook')
        ).order_by('-borrow_count')
        recommendations.extend(popular_books[:5])

        # Highly rated books
        highly_rated = Book.objects.filter(
            average_rating__gte=4.0
        ).order_by('-average_rating')
        recommendations.extend(highly_rated[:5])

        # Remove duplicates while preserving order
        seen = set()
        unique_recommendations = []
        for book in recommendations:
            if book.id not in seen:
                seen.add(book.id)
                unique_recommendations.append(book)

        return unique_recommendations[:limit]

    def get_similar_books(self, book, limit=5):
        """Get books similar to a given book"""
        return Book.objects.filter(
            Q(genres__in=book.genres.all()) |
            Q(author=book.author)
        ).exclude(
            id=book.id
        ).distinct().order_by('-average_rating')[:limit]

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
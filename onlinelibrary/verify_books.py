import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinelibrary.settings')
django.setup()

from books.models import Book, Genre

def verify_books():
    # Get all books ordered by title
    all_books = Book.objects.all().order_by('title')
    
    print(f"\nTotal number of books in database: {all_books.count()}\n")
    print("=" * 80)
    
    for book in all_books:
        print(f"\nTitle: {book.title}")
        print(f"Author: {book.author}")
        print(f"Rating: {book.average_rating}")
        print(f"Badge: {book.badge if book.badge else 'None'}")
        print(f"Genres: {', '.join([genre.name for genre in book.genres.all()])}")
        print("-" * 40)

if __name__ == '__main__':
    verify_books() 
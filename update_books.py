import os
import django
import sys

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinelibrary.settings')
django.setup()

from books.models import Book

def update_books():
    # Get all books
    books = Book.objects.all()
    
    # Update each book
    for book in books:
        book.price = 50
        book.stock = 5
        book.save()
        print(f"Updated book: {book.title} - Price: {book.price}, Stock: {book.stock}")

if __name__ == '__main__':
    print("Starting book updates...")
    update_books()
    print("All books have been updated successfully!") 
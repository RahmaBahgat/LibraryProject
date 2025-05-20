import os
import django
import json
from django.core.management import execute_from_command_line

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinelibrary.settings')
django.setup()

from books.models import Book
from django.conf import settings

def test_book_loading():
    print("\n=== Testing Book Loading ===")
    
    # 1. Check if books exist in database
    books = Book.objects.all()
    print(f"\n1. Database Check:")
    print(f"Total books in database: {books.count()}")
    
    # 2. Check book details
    print("\n2. Book Details:")
    for book in books:
        print(f"\nBook: {book.title}")
        print(f"- Author: {book.author}")
        print(f"- Has image: {'Yes' if book.image else 'No'}")
        if book.image:
            print(f"- Image path: {book.image.url}")
        print(f"- Stock: {book.stock}")
    
    # 3. Check image paths
    print("\n3. Image Path Check:")
    media_dir = os.path.join(settings.MEDIA_ROOT, 'books')
    static_dir = os.path.join(settings.BASE_DIR, 'onlinelibrary', 'Static', 'images', 'books')
    
    print(f"Media directory exists: {os.path.exists(media_dir)}")
    print(f"Static directory exists: {os.path.exists(static_dir)}")
    
    # 4. Check search functionality
    print("\n4. Search Test:")
    test_terms = ['the', 'book', 'a']
    for term in test_terms:
        matching_books = books.filter(title__icontains=term)
        print(f"\nSearch term: '{term}'")
        print(f"Found {matching_books.count()} books")
        for book in matching_books:
            print(f"- {book.title}")
    
    # 5. Check JSON data
    print("\n5. JSON Data Check:")
    books_json = json.dumps([{
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'image': book.image.url if book.image else None,
        'category': book.genre if hasattr(book, 'genre') else None
    } for book in books])
    
    print(f"JSON data length: {len(books_json)}")
    print("JSON data sample:", books_json[:200] + "...")

if __name__ == "__main__":
    test_book_loading() 
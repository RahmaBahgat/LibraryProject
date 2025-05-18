import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinelibrary.onlinelibrary.settings')
django.setup()

# Import models
from onlinelibrary.books.models import Book

# Create a test book
book = Book.objects.create(
    title="Test Book for Management",
    author="Test Author",
    description="This is a test book to demonstrate add, edit, and delete functionality.",
    isbn="9781234567890",
    price=19.99,
    stock=10,
    badge="new-release"
)

print(f"Test book created with ID: {book.id}") 
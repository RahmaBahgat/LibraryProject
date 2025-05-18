import os
import django
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinelibrary.settings')
django.setup()

from django.core.files import File
from books.models import Book
from django.conf import settings

def assign_images_to_books():
    # Get all books without images
    books_without_images = Book.objects.filter(image='')
    
    if not books_without_images:
        print("All books already have images assigned.")
        return
    
    # Get a list of sample images from the static directory since the media directory might be empty
    static_images_dir = os.path.join(settings.BASE_DIR, 'Static', 'images')
    
    print(f"Looking for images in: {static_images_dir}")
    
    if not os.path.exists(static_images_dir):
        print(f"Static images directory {static_images_dir} does not exist.")
        return
    
    # Get image files with common extensions
    available_images = []
    
    for ext in ['.jpg', '.jpeg', '.png']:
        available_images.extend([
            os.path.join(static_images_dir, f) 
            for f in os.listdir(static_images_dir) 
            if f.lower().endswith(ext)
        ])
    
    # Also check if there's a books subdirectory
    books_images_dir = os.path.join(static_images_dir, 'books')
    if os.path.exists(books_images_dir):
        for ext in ['.jpg', '.jpeg', '.png']:
            available_images.extend([
                os.path.join(books_images_dir, f) 
                for f in os.listdir(books_images_dir) 
                if f.lower().endswith(ext)
            ])
    
    if not available_images:
        print("No images available in the static images directories.")
        return
    
    print(f"Found {len(books_without_images)} books without images.")
    print(f"Found {len(available_images)} available images.")
    
    # Assign images to books
    count = 0
    for book in books_without_images:
        if not available_images:
            break
            
        # Pick a random image
        image_path = random.choice(available_images)
        
        try:
            # Open the image file
            with open(image_path, 'rb') as img_file:
                # Set the image field of the book
                file_name = os.path.basename(image_path)
                book.image.save(
                    file_name, 
                    File(img_file), 
                    save=True
                )
            
            count += 1
            print(f"Assigned image {file_name} to book '{book.title}'.")
            
            # Remove the used image from the list to avoid duplicates
            available_images.remove(image_path)
            
        except Exception as e:
            print(f"Error assigning image to book '{book.title}': {e}")
    
    print(f"Assigned images to {count} books.")

if __name__ == "__main__":
    assign_images_to_books() 
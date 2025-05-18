import os
import json
import django
import shutil
from pathlib import Path

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinelibrary.settings')
django.setup()

from books.models import Book
from django.conf import settings

# Load Data.js to extract book information
def extract_books_from_data_js():
    # Path to the data.js file
    data_js_path = os.path.join(settings.BASE_DIR, 'onlinelibrary', 'Static', 'js', 'data.js')
    
    try:
        with open(data_js_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
            # Extract the JSON-like book data structure
            start_index = content.find('let books = JSON.parse(localStorage.getItem(\'books\')) || [')
            if start_index == -1:
                # Fallback: try to find just the array start
                start_index = content.find('[')
                if start_index == -1:
                    raise Exception("Cannot find book data array in data.js")
            else:
                # Skip to the actual array start
                start_index = content.find('[', start_index)
            
            # Find the end of the array
            end_index = content.find('];', start_index)
            if end_index == -1:
                raise Exception("Cannot find end of book data array in data.js")
            
            # Extract the array portion of the code
            array_str = content[start_index:end_index+1]
            
            # Convert JavaScript object to valid JSON
            # Replace single quotes with double quotes, handle unquoted keys
            array_str = array_str.replace("'", '"')
            
            # Handle JS template literals
            array_str = array_str.replace('`', '"').replace('${', '{')
            
            # Extract book data manually since the format is not valid JSON
            books_data = []
            current_book = {}
            in_book = False
            
            lines = array_str.split('\n')
            for i, line in enumerate(lines):
                line = line.strip()
                if line.startswith('{'):
                    current_book = {}
                    in_book = True
                elif line.startswith('}') and in_book:
                    books_data.append(current_book)
                    in_book = False
                elif in_book and ':' in line:
                    # Remove trailing commas
                    if line.endswith(','):
                        line = line[:-1]
                    
                    parts = line.split(':', 1)
                    if len(parts) == 2:
                        key = parts[0].strip().strip('"')
                        value = parts[1].strip()
                        
                        # Handle nested values
                        if value.startswith('[') and not value.endswith(']'):
                            # This is an array that spans multiple lines
                            continue
                        
                        # Handle the cover path
                        if key == "cover" and value.startswith('"../images/books/'):
                            # Extract just the filename
                            cover_path = value.strip('"')
                            filename = cover_path.split('/')[-1]
                            current_book['cover_filename'] = filename
            
            return books_data
    
    except Exception as e:
        print(f"Error parsing data.js: {str(e)}")
        return []

def copy_book_covers():
    # Get book data from data.js
    books_data = extract_books_from_data_js()
    
    # Source directory for book cover images
    source_dir = os.path.join(settings.BASE_DIR, 'onlinelibrary', 'Static', 'images', 'books')
    
    # Destination directory for media files
    dest_dir = os.path.join(settings.MEDIA_ROOT, 'books')
    
    # Create the destination directory if it doesn't exist
    os.makedirs(dest_dir, exist_ok=True)
    
    # Process each book
    for book_data in books_data:
        if 'cover_filename' not in book_data:
            continue
            
        # Get the cover filename
        cover_filename = book_data['cover_filename']
        
        # Source and destination paths
        source_path = os.path.join(source_dir, cover_filename)
        dest_path = os.path.join(dest_dir, cover_filename)
        
        # Check if source file exists
        if os.path.exists(source_path):
            # Copy the file
            shutil.copy2(source_path, dest_path)
            print(f"Copied {cover_filename} to {dest_path}")
            
            # Update the book record in the database
            try:
                # Try to find the book by title (assuming titles are unique)
                title = book_data.get('title')
                if title:
                    books = Book.objects.filter(title=title)
                    if books.exists():
                        book = books.first()
                        # Update the image field to point to the copied file
                        book.image = f'books/{cover_filename}'
                        book.save()
                        print(f"Updated book record for '{title}' with cover image")
                    else:
                        print(f"Book not found: {title}")
            except Exception as e:
                print(f"Error updating book record: {str(e)}")
        else:
            print(f"Source file not found: {source_path}")

def main():
    print("Starting import of book covers...")
    copy_book_covers()
    print("Import completed!")

if __name__ == "__main__":
    main() 
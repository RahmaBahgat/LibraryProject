import os
import json
import django
import shutil
from decimal import Decimal
from pathlib import Path

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinelibrary.settings')
django.setup()

from books.models import Book, Genre
from django.conf import settings

# Function to extract book data from data.js file
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
            
            # Process the book objects line by line
            books_data = []
            current_book = {}
            in_book = False
            
            lines = array_str.split('\n')
            for i, line in enumerate(lines):
                line = line.strip()
                
                # Start of a new book object
                if line.startswith('{'):
                    current_book = {}
                    in_book = True
                
                # End of current book object
                elif line.startswith('}') and in_book:
                    books_data.append(current_book)
                    in_book = False
                
                # Process book properties
                elif in_book and ':' in line:
                    # Remove trailing commas
                    if line.endswith(','):
                        line = line[:-1]
                    
                    parts = line.split(':', 1)
                    if len(parts) == 2:
                        key = parts[0].strip().strip('"')
                        value = parts[1].strip()
                        
                        # Handle different property types
                        if key == 'id':
                            current_book['id'] = value.strip('"')
                        elif key == 'title':
                            current_book['title'] = value.strip('"')
                        elif key == 'author':
                            current_book['author'] = value.strip('"')
                        elif key == 'description' and value.startswith('`'):
                            # Handle multi-line descriptions
                            desc_lines = []
                            j = i
                            while j < len(lines) and not lines[j].strip().endswith('`'):
                                if j > i:  # Skip the first line which has the property name
                                    desc_lines.append(lines[j].strip())
                                j += 1
                            if j < len(lines):  # Add the last line without the closing backtick
                                desc_lines.append(lines[j].strip().rstrip('`,'))
                            current_book['description'] = ' '.join(desc_lines).strip()
                        elif key == 'description' and value.startswith('"'):
                            current_book['description'] = value.strip('"')
                        elif key == 'rating':
                            try:
                                current_book['rating'] = float(value)
                            except:
                                pass
                        elif key == 'genre':
                            current_book['genre'] = value.strip('"')
                        elif key == 'category' and value.startswith('['):
                            # Handle array values
                            category_str = line
                            j = i
                            while j < len(lines) and not lines[j].strip().endswith(']'):
                                j += 1
                                if j < len(lines):
                                    category_str += ' ' + lines[j].strip()
                            
                            # Extract categories from the string
                            categories = []
                            cat_start = category_str.find('[')
                            cat_end = category_str.rfind(']')
                            if cat_start != -1 and cat_end != -1:
                                cats_str = category_str[cat_start+1:cat_end]
                                # Split by commas
                                for cat in cats_str.split(','):
                                    cat = cat.strip().strip('"')
                                    if cat:
                                        categories.append(cat)
                            current_book['categories'] = categories
                        elif key == 'cover' and value.startswith('"../images/books/'):
                            # Extract just the filename
                            cover_path = value.strip('"')
                            filename = cover_path.split('/')[-1]
                            current_book['cover_filename'] = filename
                        elif key == 'badge' and value != 'null':
                            # Map badge values to Django model choices
                            badge_value = value.strip('"')
                            if badge_value == 'new-release':
                                current_book['badge'] = 'new'
                            elif badge_value in ['trending', 'bestseller', 'sale']:
                                current_book['badge'] = badge_value
            
            return books_data
    
    except Exception as e:
        print(f"Error parsing data.js: {str(e)}")
        return []

def import_books_with_covers():
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
        # Skip if missing essential data
        if 'title' not in book_data or 'author' not in book_data:
            continue
        
        title = book_data['title']
        author = book_data['author']
        
        # Check if book already exists
        if Book.objects.filter(title=title, author=author).exists():
            book = Book.objects.get(title=title, author=author)
            print(f"Book already exists: {title} by {author}")
        else:
            # Create new book
            book = Book(
                title=title,
                author=author,
                description=book_data.get('description', ''),
                average_rating=book_data.get('rating', 0.0),
                badge=book_data.get('badge')
            )
            book.save()
            print(f"Created new book: {title} by {author}")
        
        # Add genres if available
        if 'categories' in book_data and book_data['categories']:
            for category in book_data['categories']:
                genre, created = Genre.objects.get_or_create(name=category)
                book.genres.add(genre)
        
        # Handle cover image if available
        if 'cover_filename' in book_data:
            cover_filename = book_data['cover_filename']
            source_path = os.path.join(source_dir, cover_filename)
            dest_path = os.path.join(dest_dir, cover_filename)
            
            # Copy image file if it exists
            if os.path.exists(source_path):
                try:
                    shutil.copy2(source_path, dest_path)
                    print(f"Copied cover image: {cover_filename}")
                    
                    # Update book record
                    book.image = f'books/{cover_filename}'
                    book.save()
                    print(f"Updated book record with cover image")
                except Exception as e:
                    print(f"Error copying image: {str(e)}")
            else:
                print(f"Cover image not found: {source_path}")

def main():
    print("Starting import of books with covers...")
    import_books_with_covers()
    print("Import completed!")

if __name__ == "__main__":
    main() 
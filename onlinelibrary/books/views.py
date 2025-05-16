from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.core.serializers import serialize
import json
from .models import Book, BorrowedBook, Notification, User
from .forms import BookForm
from django.urls import reverse
from django.utils import timezone

def is_admin(user):
    return user.is_staff

@login_required
@user_passes_test(is_admin)
def book_detail(request, id):
    book = get_object_or_404(Book, id=id)
    return render(request, 'books/book_detail.html', {'book': book})

@login_required
@user_passes_test(is_admin)
def admin_book_management(request):
    books = Book.objects.all().order_by('-created_at')
    # Use the to_dict method for serialization
    books_data = [book.to_dict() for book in books]
    
    return render(request, 'HomePage-admin.html', {
        'books': json.dumps(books_data),
        'books_list': books  # For the grid view
    })

@login_required
@user_passes_test(is_admin)
def list_books(request):
    books = Book.objects.all().order_by('-created_at')
    return render(request, 'books/book_list.html', {'books': books})

@login_required
@user_passes_test(is_admin)
def add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            book = form.save()
            # Create notifications for all admins
            for admin in User.objects.filter(is_staff=True):
                Notification.objects.create(
                    recipient=admin,
                    title=f'Book Added: {book.title}',
                    message=f"Admin {request.user.username} has added the book '{book.title}' to the library",
                    notification_type='book_added',
                    related_book=book
                )
            messages.success(request, 'Book added successfully!')
            return redirect(f"{reverse('books_admin:admin_book_management')}?added=true")
    else:
        form = BookForm()
    return render(request, 'books/book_form.html', {'form': form, 'action': 'Add'})

@login_required
@user_passes_test(is_admin)
def edit_book(request, id):
    book = get_object_or_404(Book, id=id)
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            book = form.save()
            # Create notifications for all admins
            for admin in User.objects.filter(is_staff=True):
                Notification.objects.create(
                    recipient=admin,
                    title=f'Book Updated: {book.title}',
                    message=f"Admin {request.user.username} has updated the book '{book.title}'",
                    notification_type='book_edited',
                    related_book=book
                )
            messages.success(request, 'Book updated successfully!')
            return redirect('books_admin:admin_book_management')
    else:
        form = BookForm(instance=book)
    return render(request, 'books/book_form.html', {'form': form, 'book': book, 'action': 'Edit'})

@login_required
@user_passes_test(is_admin)
def delete_book(request, id):
    book = get_object_or_404(Book, id=id)
    title = book.title
    book.delete()
    # Create notifications for all admins
    for admin in User.objects.filter(is_staff=True):
        Notification.objects.create(
            recipient=admin,
            title=f'Book Removed: {title}',
            message=f"Admin {request.user.username} has removed the book '{title}' from the library",
            notification_type='book_removed'
        )
    messages.success(request, 'Book deleted successfully!')
    return redirect('books_admin:admin_book_management')

@login_required
@user_passes_test(is_admin)
def api_list_books(request):
    books = Book.objects.all().order_by('-created_at')
    books_data = [{
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'description': book.description,
        'isbn': book.isbn,
        'price': str(book.price),
        'stock': book.stock,
        'image': book.image.url if book.image else None,
        'created_at': book.created_at.isoformat()
    } for book in books]
    return JsonResponse({'books': books_data})

@login_required
def home_user(request):
    borrowed_books = BorrowedBook.objects.filter(user=request.user)
    recommended_books = Book.objects.order_by('-rating')[:5]
    context = {
        'borrowed_books': borrowed_books,
        'recommended_books': recommended_books,
    }
    return render(request, 'HomePage-user.html', context)

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    total_books = Book.objects.count()
    borrowed_count = BorrowedBook.objects.filter(return_date__isnull=True).count()
    context = {
        'total_books': total_books,
        'borrowed_count': borrowed_count,
    }
    return render(request, 'HomePage-admin.html', context)

@login_required
def borrow_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    if book.stock > 0:
        # Create borrowed book record
        borrowed = BorrowedBook.objects.create(
            user=request.user,
            book=book
        )
        book.stock -= 1
        book.save()
        
        # Create notification for the user
        Notification.objects.create(
            recipient=request.user,
            title=f'Book Borrowed: {book.title}',
            message=f"You have successfully borrowed '{book.title}'",
            notification_type='book_borrowed',
            related_book=book
        )
        
        # Create notification for admins
        for admin in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin,
                title=f'Book Borrowed: {book.title}',
                message=f"User {request.user.username} has borrowed '{book.title}'",
                notification_type='book_borrowed',
                related_book=book
            )
        
        messages.success(request, f'You have successfully borrowed {book.title}')
        return redirect('index')
    else:
        messages.error(request, 'This book is currently out of stock')
        return redirect('index')

@login_required
def return_book(request, borrowed_id):
    borrowed = get_object_or_404(BorrowedBook, id=borrowed_id, user=request.user)
    if not borrowed.is_returned:
        borrowed.is_returned = True
        borrowed.return_date = timezone.now()
        borrowed.save()
        
        # Update book stock
        book = borrowed.book
        book.stock += 1
        book.save()
        
        # Create notification for the user
        Notification.objects.create(
            recipient=request.user,
            title=f'Book Returned: {book.title}',
            message=f"You have successfully returned '{book.title}'",
            notification_type='book_returned',
            related_book=book
        )
        
        # Create notification for admins
        for admin in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin,
                title=f'Book Returned: {book.title}',
                message=f"User {request.user.username} has returned '{book.title}'",
                notification_type='book_returned',
                related_book=book
            )
        
        messages.success(request, f'You have successfully returned {book.title}')
    return redirect('borrowed-list')

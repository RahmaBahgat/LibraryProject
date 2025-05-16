from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.core.serializers import serialize
import json
from .models import Book, BorrowedBook
from .forms import BookForm
from django.urls import reverse

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
            messages.success(request, 'Book added successfully!')
            # Redirect back to admin home with success parameter
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
            form.save()
            messages.success(request, 'Book updated successfully!')
            return redirect('books_admin:admin_book_management')
    else:
        form = BookForm(instance=book)
    return render(request, 'books/book_form.html', {'form': form, 'action': 'Edit', 'book': book})

@login_required
@user_passes_test(is_admin)
def delete_book(request, id):
    book = get_object_or_404(Book, id=id)
    if request.method == 'POST':
        if book.image:
            book.image.delete()
        book.delete()
        messages.success(request, 'Book deleted successfully!')
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

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

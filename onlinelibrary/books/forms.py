from django import forms
from .models import Book

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = [
            'title', 
            'author', 
            'description', 
            'isbn',
            'price',
            'stock', 
            'image',
            'badge'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 5}),
            'badge': forms.Select(choices=Book.BADGE_CHOICES),
        }
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function addBook() {
    const errorElement = document.getElementById('error');
    errorElement.style.display = 'none';

    // Get form data
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('author', document.getElementById('author').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('isbn', document.getElementById('isbn').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('stock', document.getElementById('stock').value);
    
    // Optional fields
    const badge = document.getElementById('badge').value;
    if (badge) formData.append('badge', badge);

    // Handle image file
    const imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    try {
        const response = await fetch('/library-admin/books/add/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: formData
        });

        if (response.ok) {
            // Redirect to admin homepage with success message
            window.location.href = '/library-admin/books/?added=true';
        } else {
            const data = await response.json();
            errorElement.textContent = data.error || 'Error adding book';
            errorElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'Error adding book';
        errorElement.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Delete Book Handler
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const bookId = e.target.dataset.bookId;
            
            if (confirm('Are you sure you want to delete this book?')) {
                try {
                    const response = await fetch(`/library-admin/books/delete/${bookId}/`, {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': getCookie('csrftoken'),
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Remove book element from DOM
                        const item = e.target.closest('.carousel-item');
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.remove();
                            window.location.reload(); // Reload to update the view
                        }, 300);
                    } else {
                        const error = await response.json();
                        alert(error.message || 'Error deleting book');
                    }
                } catch (error) {
                    alert('Error deleting book');
                }
            }
        });
    });

    // Form Submission Handler
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });

                if (response.redirected) {
                    window.location.href = response.url;
                } else if (!response.ok) {
                    const error = await response.json();
                    showFormErrors(error.errors);
                }
            } catch (error) {
                showNotification('Error submitting form', 'error');
            }
        });
    });
});

// Helper Functions
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showFormErrors(errors) {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    for (const [field, messages] of Object.entries(errors)) {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            const errorContainer = input.closest('.form-group').querySelector('.error-message');
            errorContainer.textContent = messages.join(', ');
        }
    }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addBook();
        });
    }
});
        });
    }
});
                        item.style.opacity = '0';
                        setTimeout(() => item.remove(), 300);
                        showNotification('Book deleted successfully', 'success');
                    } else {
                        const error = await response.json();
                        showNotification(error.message || 'Error deleting book', 'error');
                    }
                } catch (error) {
                    showNotification('Error deleting book', 'error');
                }
            }
        });
    });

    // Form Submission Handler
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                });

                if (response.redirected) {
                    window.location.href = response.url;
                } else if (!response.ok) {
                    const error = await response.json();
                    showFormErrors(error.errors);
                }
            } catch (error) {
                showNotification('Error submitting form', 'error');
            }
        });
    });
});

// Helper Functions
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showFormErrors(errors) {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    for (const [field, messages] of Object.entries(errors)) {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            const errorContainer = input.closest('.form-group').querySelector('.error-message');
            errorContainer.textContent = messages.join(', ');
        }
    }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addBook();
        });
    }
});
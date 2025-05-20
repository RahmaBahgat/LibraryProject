const defaultBooks = [];

const STORAGE_KEY = "borrowedBooksData";

let borrowedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultBooks;

const maxBooks = 5;
let currentBorrowCount = borrowedBooks.filter(b => b.status === "Not Returned").length;

const countElement = document.getElementById("borrow-count");
const container = document.getElementById("borrowed-books-container");
const warningElement = document.getElementById("limit-warning");

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(borrowedBooks));
}

function updateBorrowCount() {
    countElement.textContent = currentBorrowCount;
    warningElement.style.display = currentBorrowCount >= maxBooks ? "block" : "none";
}

function formatFileName(title) {
    return title.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, "-");
}

function renderBooks() {
    container.innerHTML = "";
    borrowedBooks.forEach((book, index) => {
        if (book.status !== "Returned") {
            const card = document.createElement("div");
            card.className = "book-card";
            card.dataset.bookId = book.id;

            const formatted = formatFileName(book.title);
            const img = document.createElement("img");
            img.className = "book-image";
            img.src = `../images/books/${formatted}.jpg`; 
            img.onerror = () => (img.src = "images/default.jpg");

            const info = document.createElement("div");
            info.className = "book-info";
            info.innerHTML = `
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Category:</strong> ${book.category}</p>
                <p><strong>Borrowed On:</strong> ${book.borrowedOn}</p>
                <p><strong>Status:</strong> <span id="status-${index}">${book.status}</span></p>
                <textarea class="review-input" placeholder="Write your review here..."></textarea>
                <div class="button-group">
                    <button class="return-btn" data-book-id="${book.id}">Return Book</button>
                    <button class="submit-review-btn" onclick="addReview(${index})">Submit Review</button>
                    <button class="return-btn" onclick="toggleReviews(${index})">Previous Reviews</button>
                </div>
                <div id="reviews-container-${index}" style="display: none;">
                    <h3>Previous Reviews:</h3>
                    <ul id="reviews-${index}"></ul>
                </div>
            `;

            card.appendChild(img);
            card.appendChild(info);
            container.appendChild(card);
        }
    });

    updateBorrowCount();
}

function addReview(index) {
    const card = container.children[index];
    const reviewInput = card.querySelector(".review-input");
    const reviewText = reviewInput.value.trim();
    if (reviewText) {
        borrowedBooks[index].reviews.push(reviewText);
        saveToLocalStorage(); // Save changes
        reviewInput.value = "";
        renderBooks();
    }
}

function toggleReviews(index) {
    const containerId = `reviews-container-${index}`;
    const listId = `reviews-${index}`;
    const reviewsContainer = document.getElementById(containerId);
    const reviewsList = document.getElementById(listId);
    if (reviewsContainer.style.display === "none") {
        reviewsContainer.style.display = "block";
        reviewsList.innerHTML = "";
        borrowedBooks[index].reviews.forEach((review) => {
            const li = document.createElement("li");
            li.textContent = review;
            reviewsList.appendChild(li);
        });
    } else {
        reviewsContainer.style.display = "none";
    }
}

function returnBook(bookId) {
    fetch(`/book/${bookId}/toggle-borrow/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the book card from the UI
            const bookCard = document.querySelector(`.book-card[data-book-id="${bookId}"]`);
            if (bookCard) {
                bookCard.remove();
            }
            
            // Update the borrow counter
            const borrowCount = document.getElementById('borrow-count');
            const currentCount = parseInt(borrowCount.textContent);
            borrowCount.textContent = currentCount - 1;
            
            // Hide limit warning if count is less than 5
            const limitWarning = document.getElementById('limit-warning');
            if (currentCount - 1 < 5) {
                limitWarning.classList.remove('show');
                limitWarning.classList.add('hide');
            }
            
            // Show success notification
            showNotification('Book returned successfully!', 'success');
            
            // If no books left, show empty state
            if (currentCount - 1 === 0) {
                const booksContainer = document.getElementById('booksContainer');
                booksContainer.innerHTML = `
                    <div class="empty-state">
                        <h2>No Borrowed Books Found</h2>
                        <p>Books you borrow will appear here</p>
                    </div>
                `;
            }
        } else {
            showNotification(data.message || 'Error returning book', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('An error occurred while returning the book', 'error');
    });
}

// Helper function to get CSRF token
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

// Helper function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initial Render
renderBooks();

document.addEventListener('DOMContentLoaded', function() {
    // Get all return book buttons
    const returnButtons = document.querySelectorAll('.return-book');
    
    returnButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            returnBook(bookId);
        });
    });
});

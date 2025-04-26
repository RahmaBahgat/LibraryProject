const books = JSON.parse(localStorage.getItem('books')) || [];

function returnBook(index) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
    let users = JSON.parse(localStorage.getItem('users'));
    
    // Get fresh user index
    const userIndex = users.findIndex(u => u.email === loggedInUser.email);
    
    // Find the actual book index in the full borrowed array
    const bookId = borrowedBooks[index].id;
    const fullBorrowIndex = users[userIndex].books.borrowed.findIndex(b => 
        b.id === bookId && b.status === "Not Returned"
    );

    if (fullBorrowIndex === -1) return;

    // Update status
    users[userIndex].books.borrowed[fullBorrowIndex].status = "Returned";
    
    // Update local storage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Refresh loggedInUser data
    const updatedUser = users[userIndex];
    localStorage.setItem('loggedIn', JSON.stringify(updatedUser));

    // Update borrowedBooks array
    borrowedBooks = updatedUser.books.borrowed.filter(b => b.status === "Not Returned");
    
    // Re-render
    renderBooks();
    updateBorrowCount();
}

  // Updated renderBooks function
function renderBooks() {
    const container = document.getElementById('borrowed-books-container');
    container.innerHTML = "";

    if (borrowedBooks.length === 0) {
    container.innerHTML = `
        <div class="empty-state">
            <h2>No Borrowed Books Found</h2>
            <p>Books you borrow will appear here</p>
        </div>
        `;
        return;
    }
    borrowedBooks.forEach((book, index) => {
    const fullBookData = books.find(b => b.id === book.id) || {};
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
        <img src="${fullBookData.cover || 'images/default.jpg'}" class="book-image">
        <div class="book-info">
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Borrowed On:</strong> ${book.borrowedOn}</p>
            <div class="button-group">
            <button class="return-btn" onclick="returnBook(${index})">Return Book</button>
            </div>
        </div>
        `;
        container.appendChild(card);
    });
}

const STORAGE_KEY = "users";
let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));

// Initialization
let borrowedBooks = loggedInUser ? 
loggedInUser.books.borrowed.filter(b => b.status === "Not Returned") : [];

const maxBooks = 5;
let currentBorrowCount = borrowedBooks.filter(b => b.status === "Not Returned").length;

const countElement = document.getElementById("borrow-count");
const container = document.getElementById("borrowed-books-container");
const warningElement = document.getElementById("limit-warning");

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(borrowedBooks));
}

function updateBorrowCount() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
    const currentCount = loggedInUser?.books?.borrowed?.filter(b => b.status === "Not Returned").length || 0;
    
    document.getElementById('borrow-count').textContent = currentCount;
    document.getElementById('limit-warning').style.display = 
    currentCount >= 5 ? 'block' : 'none';
}

function formatFileName(title) {
    return title.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, "-");
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

function returnBook(index) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedIn'));
    let users = JSON.parse(localStorage.getItem('users'));
    
    const userIndex = users.findIndex(u => u.email === loggedInUser.email);
    
    // Mark as returned
    users[userIndex].books.borrowed[index].status = "Returned";
    
    // Update storage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedIn', JSON.stringify(users[userIndex]));
    
    // Re-render without page reload
    renderBooks();
}
// Initial Render
renderBooks();
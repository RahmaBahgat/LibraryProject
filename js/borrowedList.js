const defaultBooks = [
    {
        title: "Divine Rivals",
        author: "Rebecca Ross",
        category: "Fantasy",
        borrowedOn: "2025-03-15",
        status: "Not Returned",
        reviews: [],
    },
    {
        title: "في ممر الفئران",
        author: "أحمد خالد توفيق",
        category: "Arabic novel",
        borrowedOn: "2025-03-20",
        status: "Not Returned",
        reviews: [],
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-help",
        borrowedOn: "2025-04-10",
        status: "Not Returned",
        reviews: [],
    },
    {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        category: "Thriller",
        borrowedOn: "2025-04-12",
        status: "Not Returned",
        reviews: [],
    },
    {
        title: "Kafka on the Shore",
        author: "Haruki Murakami",
        category: "Fiction",
        borrowedOn: "2025-04-15",
        status: "Not Returned",
        reviews: [],
    },
];

  // Local Storage Key
const STORAGE_KEY = "borrowedBooksData";

// Retrieve data from localStorage
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

            const formatted = formatFileName(book.title);
            const img = document.createElement("img");
            img.className = "book-image";
            img.src = `images/${formatted}.jpg`;
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
                    <button class="return-btn" onclick="returnBook(${index})">Return Book</button>
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

function returnBook(index) {
    borrowedBooks[index].status = "Returned";
    currentBorrowCount--;
    saveToLocalStorage(); // Save changes
    renderBooks();
}

// Initial Render
renderBooks();
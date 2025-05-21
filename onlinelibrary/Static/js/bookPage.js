// Book Page Controller
document.addEventListener("DOMContentLoaded", function () {
  // The book data is already loaded from Django view into the template
  // Just setup the event listeners
  document.getElementById("fav-btn")?.addEventListener("click", toggleFavorite);
  document.getElementById("borrow-btn")?.addEventListener("click", borrowBook);

  // If the book data wasn't properly rendered in the template, try to get it from the URL
  const bookId = getBookIdFromUrl();
  if (
    bookId &&
    document.querySelector(".book-title").textContent === "Book Title"
  ) {
    // This means the template didn't receive the book data
    fetchBookData(bookId);
  }

  // Initialize when the page loads
  const favBtn = document.getElementById("fav-btn");
  if (favBtn) {
    favBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite();
    });
  }
});

// Get book ID from URL
function getBookIdFromUrl() {
  const pathParts = window.location.pathname.split("/");
  // Find the index of 'book' and get the next part
  const bookIndex = pathParts.findIndex((part) => part === "book");
  if (bookIndex !== -1 && bookIndex + 1 < pathParts.length) {
    return pathParts[bookIndex + 1];
  }
  return null;
}

function fetchBookData(bookId) {
  // Make an AJAX request to get book data
  fetch(`/api/books/${bookId}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Book not found");
      }
      return response.json();
    })
    .then((data) => {
      updateBookPage(data.book);
      updateBorrowButton(data.book);
    })
    .catch((error) => {
      console.error("Error fetching book:", error);
    });
}

// Update the borrow button state based on whether book is already borrowed
function updateBorrowButton(book) {
  const borrowBtn = document.getElementById("borrow-btn");
  if (!borrowBtn) return;

  // Check if book is already borrowed
  if (borrowBtn.classList.contains("borrowed")) {
    // Button was already updated by Django template
    return;
  }

  // If we need to update based on AJAX data
  if (book.is_borrowed) {
    borrowBtn.textContent = "Borrowed";
    borrowBtn.classList.add("borrowed");
    borrowBtn.disabled = true;
  } else {
    borrowBtn.textContent = "Borrow";
    borrowBtn.classList.remove("borrowed");
    borrowBtn.disabled = false;
  }
}

function updateBookPage(book) {
  if (!book) return;

  // Update required fields
  document.querySelector(".book-title").textContent = book.title;
  document.querySelector(".book-author").textContent = book.author;
  document.querySelector(".p-description").textContent = book.description;

  // Update category
  const categoryElement = document.querySelector(".book-category");
  if (book.category) {
    categoryElement.textContent = Array.isArray(book.category)
      ? book.category.join(", ")
      : book.category;
  } else if (book.genre) {
    categoryElement.textContent = book.genre;
  } else {
    categoryElement.textContent = "Uncategorized";
  }

  // Update book cover
  const imgContainer = document.querySelector(".img-container img");
  if (imgContainer) {
    imgContainer.src =
      book.image || book.cover_path || "/static/images/books/default-cover.jpg";
    imgContainer.alt = `${book.title} cover`;
  }

  updateFavoriteButton(book);
}

function updateFavoriteButton(book) {
  const favBtn = document.getElementById("fav-btn");
  if (!favBtn) return;

  favBtn.innerHTML = "";
  const icon = document.createElement("span");
  icon.className = "icon";
  icon.textContent = book.is_favorite ? "❤️" : "♡";

  const text = document.createElement("span");
  text.className = "fav-text";
  text.textContent = book.is_favorite
    ? "Remove from Favorites"
    : "Add to Favorites";

  favBtn.appendChild(text);
  favBtn.appendChild(icon);

  // Update button class
  if (book.is_favorite) {
    favBtn.classList.add("favorited");
  } else {
    favBtn.classList.remove("favorited");
  }
}

// Get CSRF token from cookie
function getCSRFToken() {
  const name = "csrftoken";
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Toggle favorite status
async function toggleFavorite() {
  const bookId = getBookIdFromUrl();
  if (!bookId) {
    console.error("No book ID found in URL");
    return;
  }

  const favBtn = document.getElementById("fav-btn");
  if (!favBtn) {
    console.error("Favorite button not found");
    return;
  }

  try {
    const csrfToken = getCSRFToken();
    if (!csrfToken) {
      throw new Error("CSRF token not found");
    }

    const response = await fetch(`/book/${bookId}/toggle-favorite/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Update the button state
      const icon = favBtn.querySelector(".icon");
      const text = favBtn.querySelector(".fav-text");

      if (data.is_favorite) {
        icon.textContent = "❤️";
        text.textContent = "Remove from Favorites";
        favBtn.classList.add("favorited");
      } else {
        icon.textContent = "♡";
        text.textContent = "Add to Favorites";
        favBtn.classList.remove("favorited");
      }
    } else {
      throw new Error(data.message || "Failed to toggle favorite status");
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    alert("Failed to update favorite status. Please try again.");
  }
}

function borrowBook() {
  const bookId = getBookIdFromUrl();
  if (!bookId) return;

  const borrowBtn = document.getElementById("borrow-btn");
  const isCurrentlyBorrowed = borrowBtn.classList.contains("borrowed");

  // Send request to borrow/return the book
  fetch(`/library-admin/books/book/${bookId}/toggle-borrow/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // Update the borrow button based on the new state
        if (data.is_borrowed) {
          borrowBtn.textContent = "Borrowed";
          borrowBtn.classList.add("borrowed");
          borrowBtn.disabled = true;
        } else {
          borrowBtn.textContent = "Borrow";
          borrowBtn.classList.remove("borrowed");
          borrowBtn.disabled = false;
        }

        // Show success message
        alert(data.message);
      } else {
        // Show error message
        alert(
          data.message || "Failed to process the request. Please try again."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}

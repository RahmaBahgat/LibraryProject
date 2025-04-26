document.addEventListener("DOMContentLoaded", function() {
  // Form validation
  function validateForm() {
    const requiredFields = ['id', 'title', 'author', 'cover', 'genre', 'description'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        field.style.border = "1px solid red";
        isValid = false;
      } else {
        field.style.border = "";
      }
    });

    if (!isValid) {
      document.getElementById('error').textContent = "Please fill all required fields!";
      return false;
    }
    return true;
  }

  // Add book function
  window.addBook = function() {
    if (!validateForm()) return;

    const newBook = {
      id: document.getElementById('id').value.trim(),
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      cover: document.getElementById('cover').value.trim(),
      genre: document.getElementById('genre').value.trim(),
      description: document.getElementById('description').value.trim(),
      // Optional fields
      category: document.getElementById('category').value.trim() || undefined,
      rating: document.getElementById('rating').value ? parseFloat(document.getElementById('rating').value) : undefined,
      badge: document.getElementById('badge').value || undefined,
      timestamp: new Date().getTime() // For sorting
    };

    // 1. Get existing books from localStorage
    let existingBooks = JSON.parse(localStorage.getItem('libraryBooks')) || [];
    
    // 2. Add new book to beginning of array
    existingBooks.unshift(newBook);
    
    // 3. Save back to localStorage
    localStorage.setItem('libraryBooks', JSON.stringify(existingBooks));
    
    // 4. Show success and redirect
    alert("Book added successfully!");
    window.location.href = "HomePage-admin.html?added=true";
  };
});
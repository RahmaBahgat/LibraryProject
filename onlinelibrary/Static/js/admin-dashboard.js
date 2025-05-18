// Admin Dashboard JavaScript

// Initialize carousels and other admin features
document.addEventListener('DOMContentLoaded', function() {
  // Initialize carousels
  const carousels = document.querySelectorAll('.book-carousel');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    
    if (track && prevButton && nextButton) {
      // Scroll left on prev button click
      prevButton.addEventListener('click', () => {
        track.scrollBy({ left: -300, behavior: 'smooth' });
      });
      
      // Scroll right on next button click
      nextButton.addEventListener('click', () => {
        track.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });
  
  // Check for success message in URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("added")) {
    showNotification("Book added successfully!", "success");
  } else if (urlParams.has("deleted")) {
    showNotification("Book deleted successfully!", "success");
  } else if (urlParams.has("updated")) {
    showNotification("Book updated successfully!", "success");
  }
  
  // Add event listeners for delete buttons
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const bookId = this.dataset.bookId;
      
      // Show the modal
      const modal = document.getElementById('modal-overlay');
      const confirmButton = modal.querySelector('.btn-confirm');
      const cancelButton = modal.querySelector('.btn-cancel');
      const closeButton = modal.querySelector('.close-modal');
      
      // Show modal
      modal.style.display = 'flex';
      
      // Setup confirm action
      confirmButton.onclick = function() {
        deleteBook(bookId);
        modal.style.display = 'none';
      };
      
      // Setup cancel action
      cancelButton.onclick = closeButton.onclick = function() {
        modal.style.display = 'none';
      };
    });
  });
});

// Show notification function
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '15px 20px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  notification.style.minWidth = '250px';
  notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  notification.style.animation = 'fadeIn 0.3s ease-in-out';
  
  // Set colors based on type
  if (type === 'success') {
    notification.style.backgroundColor = '#28a745';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#dc3545';
    notification.style.color = 'white';
  } else {
    notification.style.backgroundColor = '#007bff';
    notification.style.color = 'white';
  }
  
  // Add content
  notification.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span>${message}</span>
      <button style="background:none; border:none; color:white; font-size:18px; font-weight:bold; cursor:pointer; margin-left:15px;">&times;</button>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Add close functionality
  const closeButton = notification.querySelector('button');
  closeButton.addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-in-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
  
  // Clear the URL parameter
  history.replaceState({}, document.title, window.location.pathname);
}

// Function to handle book deletion
async function deleteBook(bookId) {
  try {
    const response = await fetch(`/library-admin/books/delete/${bookId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });

    if (response.ok) {
      // Reload the page to show updated book list
      window.location.href = window.location.pathname + '?deleted=true';
    } else {
      showNotification('Error deleting book', 'error');
    }
  } catch (error) {
    showNotification('Error deleting book: ' + error.message, 'error');
  }
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

// Add CSS for animations
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }
  </style>
`); 
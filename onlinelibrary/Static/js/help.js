function createAccount() {
  alert(
    `Create account \n
        1.Click 'Sign Up' in the top-right corner
        2.Fill in your details:
            Enter your full name
            Add your email address
            secure password (8+ characters)
            Check your email and click the confirmation link
            Log in to access all features

        `
  );
}

function search() {
  alert(
    `U can use the search bar on the top and get the book using its title , author or category`
  );
}

function borrowANDadd() {
  alert(`choose the book u want and press into borrow button or favourite `);
}

function aboutAuthor() {
  alert();
}

function getBorrowedBook() {
  alert("from my books in the top bar");
}

function EditOrDelete() {
  alert(`choose the book then click edit or delete`);
}

// function does not completed yet
// function addBook() {
//     alert(
//         1Click
//     )
// }

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Chat button functionality
    const chatButton = document.querySelector('.chat-button');
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            alert('Live chat feature coming soon! Please email us at support@inotherwords.com for immediate assistance.');
        });
    }

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
});

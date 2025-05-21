document.addEventListener('DOMContentLoaded', () => {
    // Navbar functionality
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Load user information via AJAX
    loadUserInfo();
    
    // Check for notifications every minute
    checkNotifications();
    setInterval(checkNotifications, 60000);

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 
            'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 
            'rotate(-45deg) translate(7px, -7px)' : '';
    });
});

// Function to load user info via AJAX
function loadUserInfo() {
    const userInfoElement = document.querySelector('.user-info');
    const loginButton = document.querySelector('.login-button');
    
    if (!userInfoElement) return;
    
    fetch('/api/user-info/', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.is_authenticated) {
            // User is logged in, update user info
            if (userInfoElement) {
                userInfoElement.innerHTML = `
                    <img src="${data.profile_pic || '/static/images/default-avatar.png'}" alt="${data.username}" class="user-avatar">
                    <span class="username">${data.username}</span>
                `;
                userInfoElement.style.display = 'flex';
                
                if (loginButton) {
                    loginButton.style.display = 'none';
                }
            }
        } else {
            // User is not logged in
            if (userInfoElement) {
                userInfoElement.style.display = 'none';
            }
            
            if (loginButton) {
                loginButton.style.display = 'block';
            }
        }
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
    });
}

// Function to check notifications via AJAX
function checkNotifications() {
    const notificationBadge = document.querySelector('.notification-badge');
    
    if (!notificationBadge) return;
    
    fetch('/notifications/count/', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.count > 0) {
            notificationBadge.textContent = data.count > 99 ? '99+' : data.count;
            notificationBadge.style.display = 'block';
        } else {
            notificationBadge.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error fetching notifications:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const currentYear = document.querySelector('.current-year');
    currentYear.textContent = new Date().getFullYear();
});

// Search functionality
const searchForm = document.getElementById('searchForm');
const navSearch = document.querySelector('.nav-search');
const navbar = document.querySelector('.navbar');

// Add AJAX search functionality
if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = searchForm.querySelector('input[name="q"]');
        const searchValue = searchInput.value.trim();
        
        if (searchValue) {
            // Get CSRF token
            const csrftoken = getCookie('csrftoken');
            
            fetch('/search/', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify({ query: searchValue }),
                credentials: 'same-origin'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.redirect) {
                    // Redirect to search results page
                    window.location.href = data.redirect;
                } else {
                    // Handle inline results if implemented
                    console.log('Search results:', data.results);
                }
            })
            .catch(error => {
                console.error('Error performing search:', error);
                // Fallback to traditional form submission
                searchForm.submit();
            });
        }
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

// Toggle search on mobile
document.querySelector('.nav-toggle').addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        navSearch.classList.toggle('active');
        // Toggle background when search is active
        navbar.style.background = navSearch.classList.contains('active') 
            ? 'var(--cream)' 
            : '';
    }
});

// Handle window resize to reset background
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navSearch.classList.remove('active');
        navbar.style.background = '';
    }
});


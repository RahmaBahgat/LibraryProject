const testimonials = [
    {
        id: 1,
        name: "folana",
        text: "InOtherWords has completely transformed my reading experience. Their recommendations are spot-on!",
        rating: 5
    },
    {
        id: 2,
        name: "folan",
        text: "I love the community aspect of this platform. It's like having a virtual book club at my fingertips.",
        rating: 4
    },
    {
        id: 3,
        name: "folana",
        text: "The virtual bookshelf feature helps me keep track of what I've read and what I want to read next. So convenient!",
        rating: 5
    },
    {
        id: 4,
        name: "folan",
        text: "it makes reading on-the-go so effortless.",
        rating: 4
    },
    {
        id: 5,
        name: "folana",
        text: "it makes reading on-the-go so effortless.",
        rating: 5
    },
    {
        id: 5,
        name: "folan",
        text: "As someone who reads across multiple genres, I appreciate how easy it is to discover works from international authors I wouldn't find elsewhere. The translation suggestions feature is brilliant!",
        rating: 4
    }

];

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    initializeBookCarousel();
    initializeTestimonials();
    initializeFeatures();
});

// Get CSRF token from cookie
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

// Book Carousel with AJAX
function initializeBookCarousel() {
    const grid = document.querySelector('.carousel-grid');
    
    if (!grid) return;
    
    // Show loading state
    grid.innerHTML = '<div class="loading">Loading featured books...</div>';
    
    // Fetch books from API
    fetch('/api/featured-books/', {
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
        // Clear loading message
        grid.innerHTML = '';
        
        // Check if we have books
        if (!data.books || data.books.length === 0) {
            grid.innerHTML = '<div class="no-books">No featured books available</div>';
            return;
        }
        
        // Add books to carousel
        data.books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.innerHTML = `
                <div class="book-cover" style="background-image: url('${book.cover || '/static/images/default-cover.jpg'}')"></div>
                <div class="book-info">
                    <span class="book-genre">${book.genre || 'General'}</span>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">by ${book.author}</p>
                    <div class="book-actions">
                        <button class="save-btn" data-book-id="${book.id}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                            </svg>
                        </button>
                        <button class="borrow-btn" data-book-id="${book.id}">Borrow</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        // Handle button clicks with AJAX
        setupBookInteractions();
        
        // Set up carousel navigation
        setupCarouselNavigation(grid);
    })
    .catch(error => {
        console.error('Error fetching featured books:', error);
        
        // Fallback to static data if available
        if (typeof books !== 'undefined' && books.length > 0) {
            grid.innerHTML = '';
            books.forEach(book => {
                const card = document.createElement('div');
                card.className = 'carousel-card';
                card.innerHTML = `
                    <div class="book-cover" style="background-image: url('${book.cover}')"></div>
                    <div class="book-info">
                        <span class="book-genre">${book.genre}</span>
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">by ${book.author}</p>
                        <div class="book-actions">
                            <button class="save-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                </svg>
                            </button>
                            <button class="borrow-btn">Borrow</button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
            
            setupCarouselNavigation(grid);
        } else {
            grid.innerHTML = '<div class="error">Could not load featured books. Please try again later.</div>';
        }
    });
}

function setupBookInteractions() {
    // Handle favorite button clicks
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const bookId = button.dataset.bookId;
            
            // Check if user is logged in first
            const checkAuthResponse = await fetch('/check-auth/', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
            
            const authData = await checkAuthResponse.json();
            
            if (!authData.is_authenticated) {
                // Redirect to login page
                window.location.href = '/accounts/login/?next=/';
                return;
            }
            
            // User is authenticated, toggle favorite
            try {
                const csrftoken = getCookie('csrftoken');
                const response = await fetch(`/book/${bookId}/toggle-favorite/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    credentials: 'same-origin'
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                // Update button state based on response
                if (data.is_favorite) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
                
                // Show feedback
                showToast(data.is_favorite ? 'Added to favorites!' : 'Removed from favorites!');
            } catch (error) {
                console.error('Error toggling favorite:', error);
                showToast('Failed to update favorites. Please try again.');
            }
        });
    });
    
    // Handle borrow button clicks
    document.querySelectorAll('.borrow-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const bookId = button.dataset.bookId;
            
            // Check if user is logged in first
            const checkAuthResponse = await fetch('/check-auth/', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
            
            const authData = await checkAuthResponse.json();
            
            if (!authData.is_authenticated) {
                // Redirect to login page
                window.location.href = '/accounts/login/?next=/';
                return;
            }
            
            // User is authenticated, proceed with borrow
            try {
                const csrftoken = getCookie('csrftoken');
                const response = await fetch(`/book/${bookId}/borrow/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    credentials: 'same-origin'
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                
                // Update button state based on response
                if (data.success) {
                    button.textContent = 'Borrowed';
                    button.disabled = true;
                    showToast('Book borrowed successfully!');
                } else {
                    showToast(data.message || 'Failed to borrow book. Please try again.');
                }
            } catch (error) {
                console.error('Error borrowing book:', error);
                showToast('Failed to borrow book. Please try again.');
            }
        });
    });
}

function setupCarouselNavigation(grid) {
    const prevArrow = document.querySelector('.carousel-arrow.prev');
    const nextArrow = document.querySelector('.carousel-arrow.next');
    const cardWidth = 280; // Width of each card
    const gap = 32; // 2rem gap in pixels

    if (prevArrow && nextArrow) {
        nextArrow.addEventListener('click', () => {
            grid.scrollBy({
                left: cardWidth + gap,
                behavior: 'smooth'
            });
        });

        prevArrow.addEventListener('click', () => {
            grid.scrollBy({
                left: -(cardWidth + gap),
                behavior: 'smooth'
            });
        });

        // Optional: Hide arrows when at scroll boundaries
        const handleScroll = () => {
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            prevArrow.style.display = grid.scrollLeft <= 0 ? 'none' : 'flex';
            nextArrow.style.display = grid.scrollLeft >= maxScroll - 1 ? 'none' : 'flex';
        };

        grid.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll(); // Initial check
    }
}

// Testimonials Carousel with AJAX
function initializeTestimonials() {
    const grid = document.querySelector('.testimonials-grid');
    
    if (!grid) return;
    
    // Show loading state
    grid.innerHTML = '<div class="loading">Loading testimonials...</div>';
    
    // Fetch testimonials from API
    fetch('/api/testimonials/', {
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
        // Clear loading message
        grid.innerHTML = '';
        
        // Check if we have testimonials
        if (!data.testimonials || data.testimonials.length === 0) {
            grid.innerHTML = '<div class="no-testimonials">No testimonials available</div>';
            return;
        }
        
        // Add testimonials to carousel
        data.testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
                <p>${testimonial.text}</p>
                <div class="testimonial-author">
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <div class="card-rating">
                        ${createStarRating(testimonial.rating)}
                    </div>
                </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        // Set up testimonial navigation
        setupTestimonialNavigation(grid);
    })
    .catch(error => {
        console.error('Error fetching testimonials:', error);
        
        // Fallback to static data
        grid.innerHTML = '';
        testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
                <p>${testimonial.text}</p>
                <div class="testimonial-author">
                <div class="author-info">
                    <h4>${testimonial.name}</h4>
                    <div class="card-rating">
                        ${createStarRating(testimonial.rating)}
                    </div>
                </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        setupTestimonialNavigation(grid);
    });
}

function setupTestimonialNavigation(grid) {
    const prevArrow = document.querySelector('.testimonials .prev');
    const nextArrow = document.querySelector('.testimonials .next');
    const cardWidth = 300; // Width of each testimonial card
    const gap = 32; // 2rem gap in pixels

    if (prevArrow && nextArrow) {
        // Navigation arrows
        nextArrow.addEventListener('click', () => {
            grid.scrollBy({
                left: cardWidth + gap,
                behavior: 'smooth'
            });
        });

        prevArrow.addEventListener('click', () => {
            grid.scrollBy({
                left: -(cardWidth + gap),
                behavior: 'smooth'
            });
        });

        // Handle scroll boundaries
        const handleScroll = () => {
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            prevArrow.style.display = grid.scrollLeft <= 0 ? 'none' : 'flex';
            nextArrow.style.display = grid.scrollLeft >= maxScroll - 1 ? 'none' : 'flex';
        };

        grid.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll(); // Initial check
    }
}

// Features
function initializeFeatures() {
    const grid = document.querySelector('.features-grid');
    
    if (!grid) return;
    
    // Fetch features from API
    fetch('/api/features/', {
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
        // Clear any existing content
        grid.innerHTML = '';
        
        // Check if we have features
        if (!data.features || data.features.length === 0) {
            // Use fallback static data
            useFallbackFeatures(grid);
            return;
        }
        
        // Add features from API
        data.features.forEach(feature => {
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.innerHTML = `
            <svg class="feature-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${feature.icon}
            </svg>
            <h3 class="text-xl font-bold mb-2">${feature.title}</h3>
            <p>${feature.description}</p>
            `;
            grid.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching features:', error);
        // Use fallback static data
        useFallbackFeatures(grid);
    });
}

function useFallbackFeatures(grid) {
    const features = [
        {
            icon: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"></path><path d="M15.5 9.5 12 13l1 2.5-2 2"></path><path d="M9 11.5 12 13l-1.5 2.5 2 2"></path><path d="M15.5 7.5 12 9l-.5 2.5-2.5.5"></path><path d="M19 6.3 15 7"></path>',
            title: "Curated Collections",
            description: "Our team of bibliophiles handpicks every book to ensure quality and diversity."
        },
        {
            icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
            title: "Community Reviews",
            description: "Authentic reviews from real readers to help you find your next great read."
        },
        {
            icon: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" x2="6" y1="2" y2="4"></line><line x1="10" x2="10" y1="2" y2="4"></line><line x1="14" x2="14" y1="2" y2="4"></line>',
            title: "Reading Comfort",
            description: "Customizable reading experience with adjustable text, themes, and more."
        },
        {
            icon: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>',
            title: "Personal Libraries",
            description: "Create and organize your virtual bookshelves to track your reading journey."
        }
    ];
    
    // Clear any existing content
    grid.innerHTML = '';
    
    features.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
        <svg class="feature-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${feature.icon}
        </svg>
        <h3 class="text-xl font-bold mb-2">${feature.title}</h3>
        <p>${feature.description}</p>
        `;
        grid.appendChild(card);
    });
}

// Utility Functions
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    let html = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            html += '<i class="fas fa-star"></i>';
        } else {
            html += '<i class="far fa-star"></i>';
        }
    }
    
    return html;
}

// Toast notification helper
function showToast(message) {
    // Check if toast container exists, create if not
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

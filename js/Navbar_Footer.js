document.addEventListener('DOMContentLoaded', () => {
    // Navbar functionality
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

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

document.addEventListener('DOMContentLoaded', () => {
    const currentYear = document.querySelector('.current-year');
    currentYear.textContent = new Date().getFullYear();
});


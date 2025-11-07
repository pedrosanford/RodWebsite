// Main JavaScript for Rod Samra Website

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeMobileNav();
});

// Load reusable components
async function loadComponents() {
    try {
        // Load navbar
        const navbarResponse = await fetch('/src/components/navbar.html');
        const navbarHTML = await navbarResponse.text();
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = navbarHTML;
        }

        // Load footer
        const footerResponse = await fetch('/src/components/footer.html');
        const footerHTML = await footerResponse.text();
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
        }

        // Load contact form
        const contactResponse = await fetch('/src/components/contactForm.html');
        const contactHTML = await contactResponse.text();
        const contactContainer = document.getElementById('contact-form-container');
        if (contactContainer) {
            contactContainer.innerHTML = contactHTML;
        }

        // Re-initialize event listeners after components are loaded
        initializeContactForm();
        initializeMobileNav();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Initialize contact form popup
function initializeContactForm() {
    // Get all contact trigger buttons
    const contactTriggers = document.querySelectorAll('.contact-trigger');
    const contactOverlay = document.getElementById('contact-overlay');
    const closeContact = document.getElementById('close-contact');
    const contactForm = document.getElementById('contact-form');

    // Open contact form
    contactTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            if (contactOverlay) {
                contactOverlay.classList.add('active');
            }
        });
    });

    // Close contact form
    if (closeContact) {
        closeContact.addEventListener('click', function() {
            contactOverlay.classList.remove('active');
        });
    }

    // Close on overlay click
    if (contactOverlay) {
        contactOverlay.addEventListener('click', function(e) {
            if (e.target === contactOverlay) {
                contactOverlay.classList.remove('active');
            }
        });
    }

    // Form submission is handled by FormSubmit - no JavaScript interception needed
}

// Initialize mobile navigation
function initializeMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

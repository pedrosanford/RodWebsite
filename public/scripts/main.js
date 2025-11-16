// Main JavaScript for Rod Samra Website

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeContactForm();
    initializeMobileNav();
    initializeBackToTop();
    initializeHomeContactForm();
    initializeNavbarShrink();
    console.log('All functions initialized');
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

    // Handle popup form AJAX submission for Netlify Forms
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('popup-form-success-message');

    if (contactForm) {
        console.log('Contact form found, attaching AJAX handler');
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submission intercepted');
            const formData = new FormData(contactForm);

            // Add form-name for Netlify Forms
            formData.append('form-name', 'contact');

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    contactForm.style.display = 'none';
                    if (successMessage) {
                        successMessage.style.display = 'block';
                    }
                    contactForm.reset();

                    // Auto-close after 2.5 seconds
                    setTimeout(function() {
                        if (contactOverlay) {
                            contactOverlay.classList.remove('active');
                        }
                        contactForm.style.display = 'block';
                        if (successMessage) {
                            successMessage.style.display = 'none';
                        }
                    }, 2500);
                } else {
                    alert('There was an error sending your message. Please try again.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error sending your message. Please try again.');
            }
        });
    }
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

// Initialize Back to Top button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (!backToTopButton) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize Home Contact Form for Netlify Forms
function initializeHomeContactForm() {
    const homeContactForm = document.getElementById('home-contact-form');
    const successMessage = document.getElementById('home-form-success-message');

    if (!homeContactForm) return;

    homeContactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(homeContactForm);

        // Add form-name for Netlify Forms
        formData.append('form-name', 'home-contact');

        try {
            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                homeContactForm.style.display = 'none';
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
                homeContactForm.reset();

                // Show form again after 5 seconds
                setTimeout(function() {
                    homeContactForm.style.display = 'block';
                    if (successMessage) {
                        successMessage.style.display = 'none';
                    }
                }, 5000);
            } else {
                alert('There was an error sending your message. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        }
    });
}

// Initialize navbar shrink on scroll
function initializeNavbarShrink() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
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

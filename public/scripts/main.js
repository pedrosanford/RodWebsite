// Main JavaScript for Rod Samra Website

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeMobileNav();
    initializeBackToTop();
    initializeHomeContactForm();
    initializeNavbarShrink();
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

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // For now, we'll use mailto as a fallback
            // Replace this with your actual form handling (Formspree, etc.)
            const mailtoLink = `mailto:pedrosamsan@gmail.com?subject=Contact from ${data.name}&body=${encodeURIComponent(
                `Name: ${data.name}\nEmail: ${data.email}\nOrganization: ${data.organization || 'N/A'}\n\nMessage:\n${data.message}`
            )}`;

            window.location.href = mailtoLink;

            // Close the form
            contactOverlay.classList.remove('active');

            // Reset form
            contactForm.reset();
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

// Initialize Home Contact Form
function initializeHomeContactForm() {
    const homeContactForm = document.getElementById('home-contact-form');

    if (!homeContactForm) return;

    homeContactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(homeContactForm);
        const data = Object.fromEntries(formData);

        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');

        // Hide any previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        try {
            // Send to Formspree (replace with actual endpoint)
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                successMessage.style.display = 'block';
                homeContactForm.reset();
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            // Fallback to mailto if fetch fails
            const mailtoLink = `mailto:pedrosamsan@gmail.com?subject=Contact from ${data.name}&body=${encodeURIComponent(
                `Name: ${data.name}\nEmail: ${data.email}\nOrganization: ${data.organization || 'N/A'}\nPhone: ${data.phone || 'N/A'}\n\nMessage:\n${data.message}`
            )}`;

            window.location.href = mailtoLink;
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

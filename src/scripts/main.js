// Main JavaScript for Rod Samra Website

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeMobileNav();
    initializeHomeContactForm();
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
    const successMessage = document.getElementById('popup-form-success-message');

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
            // Reset form and hide success message when closing
            if (contactForm) contactForm.style.display = 'block';
            if (successMessage) successMessage.style.display = 'none';
        });
    }

    // Close on overlay click
    if (contactOverlay) {
        contactOverlay.addEventListener('click', function(e) {
            if (e.target === contactOverlay) {
                contactOverlay.classList.remove('active');
                // Reset form and hide success message when closing
                if (contactForm) contactForm.style.display = 'block';
                if (successMessage) successMessage.style.display = 'none';
            }
        });
    }

    // Handle form submission with AJAX
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://formsubmit.co/pedrosamsan@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Hide form and show success message
                    contactForm.style.display = 'none';
                    if (successMessage) {
                        successMessage.style.display = 'block';
                    }

                    // Reset form
                    contactForm.reset();

                    // Close popup after 2.5 seconds
                    setTimeout(function() {
                        contactOverlay.classList.remove('active');
                        contactForm.style.display = 'block';
                        if (successMessage) successMessage.style.display = 'none';
                    }, 2500);
                } else {
                    alert('There was an error sending your message. Please try again.');
                }
            } catch (error) {
                alert('There was an error sending your message. Please try again.');
            }
        });
    }
}

// Handle home page contact form (if it exists)
function initializeHomeContactForm() {
    const homeContactForm = document.getElementById('home-contact-form');
    const successMessage = document.getElementById('home-form-success-message');

    if (!homeContactForm) return;

    homeContactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(homeContactForm);

        try {
            const response = await fetch('https://formsubmit.co/pedrosamsan@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Hide form and show success message
                homeContactForm.style.display = 'none';
                if (successMessage) {
                    successMessage.style.display = 'block';
                }

                // Reset form
                homeContactForm.reset();

                // Show form again after 5 seconds
                setTimeout(function() {
                    homeContactForm.style.display = 'block';
                    if (successMessage) successMessage.style.display = 'none';
                }, 5000);
            } else {
                alert('There was an error sending your message. Please try again.');
            }
        } catch (error) {
            alert('There was an error sending your message. Please try again.');
        }
    });
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

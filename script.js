// Import Firebase modules (modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKp7LE6PU2kRpk8pg05Wd5Um8XXdIRJos",
  authDomain: "immersive-ttrpg-landing-8c036.firebaseapp.com",
  projectId: "immersive-ttrpg-landing-8c036",
  storageBucket: "immersive-ttrpg-landing-8c036.appspot.com",
  messagingSenderId: "7162297963",
  appId: "1:7162297963:web:7c4bc56c16ef7a7706fb2e",
  measurementId: "G-959ME75DRG"
};

// Initialize Firebase
try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('Firebase initialized successfully');

    // Add this near the top of your script, after Firebase initialization
    const IS_DEVELOPMENT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Feedback Form Submission
    document.getElementById('feedback-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = e.target.querySelector('button[type="submit"]');
        
        try {
            submitButton.disabled = true;
            submitButton.classList.add('loading');

            // Get form data
            const formData = {
                email: document.getElementById('email').value,
                role: document.getElementById('role').value,
                usage: document.getElementById('usage').value || '',  // Provide default empty string
                features: document.getElementById('features').value || '',  // Provide default empty string
                // Add environment and timestamp data
                environment: IS_DEVELOPMENT ? 'development' : 'production',
                timestamp: serverTimestamp(),
                submissionDate: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            // Validate required fields
            if (!formData.email || !formData.role) {
                throw new Error('Please fill in all required fields');
            }

            console.log(`Submitting ${formData.environment} feedback:`, formData);

            const docRef = await addDoc(collection(db, 'feedback'), formData);

            console.log(`${formData.environment} feedback submitted with ID:`, docRef.id);
            document.getElementById('feedback-form').reset();
            handleFormSuccess();
        } catch (error) {
            handleFormError(error);
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });

    // Add to script.js before the form submission
    const emailInput = document.getElementById('email');
    emailInput?.addEventListener('input', (e) => {
        const email = e.target.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        emailInput.setCustomValidity(isValid ? '' : 'Please enter a valid email address');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced form validation
    const form = document.getElementById('feedback-form');
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });

    // Enhanced Scroll to Top functionality
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    let isScrolling = false;

    // Throttled scroll handler
    const handleScroll = () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 500) {
                    scrollToTopButton.classList.add('visible');
                } else {
                    scrollToTopButton.classList.remove('visible');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    };

    // Smooth scroll to top with easing
    const scrollToTop = () => {
        const currentPosition = window.scrollY;
        if (currentPosition > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, currentPosition - currentPosition / 8);
        }
    };
    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    scrollToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToTop();
    });

    // Testimonial Carousel
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialNav = document.querySelector('.testimonial-nav');
    let currentTestimonial = 0;

    // Clear any existing dots and create navigation dots
    testimonialNav.innerHTML = ''; // Clear existing dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showTestimonial(index));
        testimonialNav.appendChild(dot);
    });

    function showTestimonial(index) {
        // Remove active class from all testimonials and dots
        testimonials.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.testimonial-dot').forEach(d => d.classList.remove('active'));
        
        // Add active class to current testimonial and dot
        testimonials[index].classList.add('active');
        document.querySelectorAll('.testimonial-dot')[index].classList.add('active');
        currentTestimonial = index;
    }

    // Auto rotate testimonials every 5 seconds
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    const navigation = document.querySelector('.navigation');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
    });

    // Add scroll reveal animations
    const revealElements = document.querySelectorAll('.tech-item, .testimonial, .roadmap-item, .pricing-card');

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // FAQ Toggle functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            // Toggle the active class on the answer
            const answer = question.nextElementSibling;
            answer.classList.toggle('active');
            
            // Toggle the + / - symbol
            const toggle = question.querySelector('.toggle');
            toggle.textContent = answer.classList.contains('active') ? '−' : '+';
            
            // Close other open FAQs
            document.querySelectorAll('.faq-answer.active').forEach(openAnswer => {
                if (openAnswer !== answer) {
                    openAnswer.classList.remove('active');
                    openAnswer.previousElementSibling.querySelector('.toggle').textContent = '+';
                }
            });
        });
    });

    // Add to script.js after Firebase initialization
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    };

    // Optimize testimonial rotation
    let testimonialInterval;
    const startTestimonialRotation = () => {
        testimonialInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    };

    const stopTestimonialRotation = () => {
        clearInterval(testimonialInterval);
    };

    // Add event listeners to pause rotation on hover
    document.querySelector('.testimonial-carousel').addEventListener('mouseenter', stopTestimonialRotation);
    document.querySelector('.testimonial-carousel').addEventListener('mouseleave', startTestimonialRotation);

    // Add after Firebase initialization
    const measurePerformance = () => {
        if (window.performance) {
            const timing = performance.timing;
            const pageLoad = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page Load Time: ${pageLoad}ms`);
            
            // Report to Firebase Analytics or your preferred analytics platform
            if (typeof gtag === 'function') {
                gtag('event', 'performance', {
                    'page_load_time': pageLoad
                });
            }
        }
    };

    window.addEventListener('load', measurePerformance);
} catch (error) {
    console.error('Error initializing Firebase:', error);
    alert('There was an issue connecting to our services. Please try again later.');
}

function handleFormSuccess() {
    const form = document.getElementById('feedback-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = "Thanks for helping shape the Visionarium experience! We'll keep you updated on our progress.";
    form.appendChild(successMessage);
    
    // Animate success message
    setTimeout(() => {
        successMessage.classList.add('visible');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

const handleFormError = (error) => {
    console.error('Form submission error:', error);
    
    const errorMessages = {
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/network-request-failed': 'Network error. Please check your connection',
        'default': 'There was an error submitting your feedback. Please try again.'
    };
    
    const message = errorMessages[error.code] || errorMessages.default;
    alert(message);
};


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

    // Feedback Form Submission
    document.getElementById('feedback-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        // Get form data
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;
        const usage = document.getElementById('usage').value;
        const features = document.getElementById('features').value;

        console.log('Attempting to submit feedback with data:', { email, role, usage, features });

        try {
            const docRef = await addDoc(collection(db, 'feedback'), {
                email: email,
                role: role,
                usage: usage,
                features: features,
                timestamp: serverTimestamp()
            });
            console.log('Feedback submitted successfully with ID:', docRef.id);
            alert('Thank you for your feedback!');
            document.getElementById('feedback-form').reset();
        } catch (error) {
            console.error('Detailed error submitting feedback:', error);
            let errorMessage = 'There was an issue submitting your feedback.';
            if (error.code === 'permission-denied') {
                errorMessage = 'Unable to submit feedback at this time. Please try again later.';
            } else if (error.code === 'unavailable') {
                errorMessage = 'Service is temporarily unavailable. Please try again later.';
            }
            alert(errorMessage);
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
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
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

    // Create navigation dots
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

    // FAQ Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Toggle the active class on the answer
            const answer = question.nextElementSibling;
            answer.classList.toggle('active');
            
            // Update the toggle symbol
            const toggle = question.querySelector('.toggle');
            toggle.textContent = answer.classList.contains('active') ? '−' : '+';
            
            // Close other open FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    otherAnswer.classList.remove('active');
                    otherQuestion.querySelector('.toggle').textContent = '+';
                }
            });
        });
    });
} catch (error) {
    console.error('Error initializing Firebase:', error);
    alert('There was an issue connecting to our services. Please try again later.');
}

const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    try {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        // Form validation
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Submit to Firebase
        await addDoc(collection(db, 'feedback'), {
            ...data,
            timestamp: serverTimestamp()
        });
        
        form.reset();
        alert('Thank you for your feedback!');
    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting the form. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
};

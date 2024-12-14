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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log('Firebase initialized successfully');

// Define IS_DEVELOPMENT variable
const IS_DEVELOPMENT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Feedback Form Submission
document.getElementById('feedback-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    console.log('Form submitted'); // Debug log

    try {
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        // Get form data
        const formData = {
            email: document.getElementById('email').value,
            role: document.getElementById('role').value,
            usage: document.getElementById('usage').value || '',  // Provide default empty string
            environment: IS_DEVELOPMENT ? 'development' : 'production',
            timestamp: serverTimestamp(),
            submissionDate: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        console.log('Form data:', formData); // Debug log

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
        console.error('Error during form submission:', error); // Debug log
        handleFormError(error);
    } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
});

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
    alert('There was an error submitting your feedback. Please try again.');
};


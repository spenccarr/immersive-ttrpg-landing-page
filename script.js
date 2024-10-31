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
} catch (error) {
    console.error('Error initializing Firebase:', error);
    alert('There was an issue connecting to our services. Please try again later.');
}

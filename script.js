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

// Parallax Effect for Hero Section
document.addEventListener('mousemove', parallax);

function parallax(e) {
    document.querySelectorAll('.slide').forEach(slide => {
        const speed = 0.05; // Adjust the speed as needed
        const x = (window.innerWidth - e.pageX * speed);
        const y = (window.innerHeight - e.pageY * speed);
        slide.style.backgroundPosition = `${x}px ${y}px`;
    });
}

// Feature Hover Effects
// Audio Feature
const audioFeature = document.getElementById('audio-feature');
let audioPreview;

audioFeature.addEventListener('mouseenter', () => {
    audioPreview = new Audio('sounds/forest-ambiance.mp3'); // Update the path as needed
    audioPreview.play();
});

audioFeature.addEventListener('mouseleave', () => {
    if (audioPreview) {
        audioPreview.pause();
        audioPreview.currentTime = 0;
    }
});

// Lighting Feature
const lightingFeature = document.getElementById('lighting-feature');
lightingFeature.addEventListener('mouseenter', () => {
    document.body.style.backgroundColor = '#222'; // Simulate dim lighting
});
lightingFeature.addEventListener('mouseleave', () => {
    document.body.style.backgroundColor = ''; // Reset to default
});

// Feedback Form Submission
document.getElementById('feedback-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value || 'Anonymous';
    const email = document.getElementById('email').value || 'No email provided';
    const comments = document.getElementById('comments').value;

    try {
        // Add feedback to Firestore
        await addDoc(collection(db, 'feedback'), {
            name: name,
            email: email,
            comments: comments,
            timestamp: serverTimestamp()
        });

        // Alert the user and clear the form
        alert('Thank you for your feedback!');
        document.getElementById('feedback-form').reset();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('There was an issue submitting your feedback. Please try again.');
    }
});

// Newsletter Subscription Handling
document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get email from the form
    const email = document.getElementById('newsletter-email').value;

    try {
        // Add email to Firestore or your newsletter service
        await addDoc(collection(db, 'newsletterSubscriptions'), {
            email: email,
            timestamp: serverTimestamp()
        });

        // Alert the user and clear the form
        alert('Thank you for subscribing!');
        document.getElementById('newsletter-form').reset();
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        alert('There was an issue with your subscription. Please try again.');
    }
});

// Interactive Scrolling Demo Logic
const scenes = [
    { id: 'intro-scene', audio: 'sounds/intro-ambiance.mp3', color: 'rgba(34, 45, 50, 0.8)' },
    { id: 'jungle-scene', audio: 'sounds/jungle-ambiance.mp3', color: 'rgba(34, 85, 45, 0.8)' },
    { id: 'town-scene', audio: 'sounds/town-market.mp3', color: 'rgba(85, 75, 55, 0.8)' },
    { id: 'cave-scene', audio: 'sounds/cave-ambiance.mp3', color: 'rgba(55, 55, 85, 0.8)' },
    { id: 'clearing-scene', audio: 'sounds/clearing-ambiance.mp3', color: 'rgba(45, 65, 85, 0.8)' }
];

let currentAudio = null;

// Function to switch scenes
function switchScene(sceneId) {
    const scene = scenes.find(s => s.id === sceneId);

    // Change background color or lighting to match the scene
    document.body.style.backgroundColor = scene.color;

    // Play scene-specific audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(scene.audio);
    currentAudio.loop = true;
    currentAudio.play();
}

// Event listeners for entering each scene
scenes.forEach(scene => {
    document.getElementById(scene.id).addEventListener('mouseenter', () => switchScene(scene.id));
});

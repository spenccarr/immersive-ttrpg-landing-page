// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIdrBrGnW-44sDHJdDYdBIgmo0ozpByWU",
    authDomain: "immersive-ttrpg-landing-page.firebaseapp.com",
    projectId: "immersive-ttrpg-landing-page",
    storageBucket: "immersive-ttrpg-landing-page.appspot.com",
    messagingSenderId: "822644301854",
    appId: "1:822644301854:web:9d75323a66486077ff8e0f",
    measurementId: "G-N4DXWEKZLY"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle form submission
document.getElementById('feedback-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const comments = document.getElementById('comments').value;

    try {
        // Save feedback to Firestore
        await addDoc(collection(db, "feedback"), {
            name: name,
            email: email,
            comments: comments,
            timestamp: serverTimestamp()
        });
        alert("Thank you for your feedback!");
        // Clear the form
        document.getElementById('feedback-form').reset();
    } catch (error) {
        console.error("Error saving feedback: ", error);
    }
});

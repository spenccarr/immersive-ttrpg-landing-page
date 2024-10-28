// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIdrBrGnW-44sDHJdDYdBIgmo0ozpByWU",
  authDomain: "immersive-ttrpg-landing-page.firebaseapp.com",
  projectId: "immersive-ttrpg-landing-page",
  storageBucket: "immersive-ttrpg-landing-page.appspot.com",
  messagingSenderId: "822644301854",
  appId: "1:822644301854:web:9d75323a66486077ff8e0f",
  measurementId: "G-N4DXWEKZLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Handle form submission
document.getElementById('feedback-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const comments = document.getElementById('comments').value;

    // Save feedback to Firestore
    db.collection('feedback').add({
        name: name,
        email: email,
        comments: comments,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Thank you for your feedback!");
        // Clear the form
        document.getElementById('feedback-form').reset();
    })
    .catch((error) => {
        console.error("Error saving feedback: ", error);
    });
});

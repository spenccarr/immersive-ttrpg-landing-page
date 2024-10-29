// Listen for the form submission
document.getElementById('feedback-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const comments = document.getElementById('comments').value;

    try {
        // Add feedback to Firestore
        await db.collection('feedback').add({
            name: name,
            email: email,
            comments: comments,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Alert the user and clear the form
        alert('Thank you for your feedback!');
        document.getElementById('feedback-form').reset();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('There was an issue submitting your feedback. Please try again.');
    }
});

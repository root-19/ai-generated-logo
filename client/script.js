document.getElementById('logoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const prompt = document.getElementById('prompt').value;
    const fontSize = parseInt(document.getElementById('fontSize').value, 10);
    const backgroundColor = document.getElementById('backgroundColor').value;
    const textColor = document.getElementById('textColor').value;
    const shapeType = parseInt(document.getElementById('shapeType').value, 10);
    const resultsDiv = document.getElementById('results');

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Send request to the backend
    fetch('http://localhost:3001/generate-logo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, fontSize, backgroundColor, textColor, shapeType })
    })
    .then(response => response.json())
    .then(data => {
        if (data.logo) {
            const img = document.createElement('img');
            img.src = data.logo; // Directly use the base64-encoded image data
            resultsDiv.appendChild(img);
        } else {
            resultsDiv.textContent = 'No logo generated. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultsDiv.textContent = 'An error occurred while generating the logo.';
    });
});

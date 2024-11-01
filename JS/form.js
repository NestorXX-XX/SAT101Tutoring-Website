document.getElementById('wf-form-Design-To-Webflow-Form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect the form data
    const formData = new FormData(this);
    
    // Convert the form data to a JSON object
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    try {
        // Send the form data to the URL using Fetch API
        const honeypot = formObject['honeypot'];
        if (honeypot) {
            console.error('Bot detected.');
            return; // Abort the submission
        }
        formObject.timestamp = new Date().toISOString(); // ISO format timestamp

        const response = await fetch('https://hook.us2.make.com/ruqaaec1arl46re4o9teozvjwxkow4ez', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        });
        

        if (response.ok) {
            // Show the success message if the form is submitted successfully
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('form-block').style.display = 'none';
            document.getElementById('Get-Started-Title').style.display = 'none';
        } else {
            // Show the error message if submission fails
            document.querySelector('#error-message').style.display = 'block';
        }
    } catch (error) {
        // Show the error message if there's a network error
        document.querySelector('#error-message').style.display = 'block';
        console.error('Form submission error:', error);
    }
   


});

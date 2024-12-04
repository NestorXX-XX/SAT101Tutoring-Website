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
        // Check for honeypot field to prevent bot submissions
        const honeypot = formObject['honeypot'];
        if (honeypot) {
            console.error('Bot detected.');
            return; // Abort the submission
        }

        // Add timestamp to the formObject
        formObject.timestamp = new Date().toISOString(); // ISO format timestamp

        // Add Client User Agent to the formObject
        formObject.client_user_agent = navigator.userAgent; // User Agent string

        // Fetch IP and location details using ipgeolocation.io
        const geoResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=7c74069e88c34bc7aa7ce737933abf70`);
        const geoData = await geoResponse.json();
        
        // Add geolocation data to the formObject
        formObject.ip_address = geoData.ip;
        formObject.city = geoData.city;
        formObject.region = geoData.state_prov; // State/Region
        formObject.postal_code = geoData.zipcode;
        formObject.country = geoData.country_name; // Country

        // Send the form data along with geolocation and user agent to the specified URL
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

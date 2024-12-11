document.getElementById('wf-form-Design-To-Webflow-Form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect the form data and convert it to a JSON object
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Check for honeypot field to prevent bot submissions
    if (formObject['honeypot']) {
        console.error('Bot detected.');
        return; // Abort the submission
    }

    // Add timestamp
    formObject.timestamp = new Date().toISOString(); // ISO format timestamp

    // Add user agent
    formObject.client_user_agent = navigator.userAgent; // User Agent string

    // Capture referrer URL
    formObject.referrer_url = document.referrer || 'Direct Traffic'; // Referrer URL or default to 'Direct Traffic'

    // Capture fbclid (Facebook Click ID) if present in the URL
    const urlParams = new URLSearchParams(window.location.search);
    formObject.fbclid = urlParams.get('fbclid') || null; // Null if not available

    // Generate Browser ID (_fbp)
    formObject._fbp = generateFbp(); // Generate a valid Facebook Pixel Browser ID

    // Capture Lead ID if available in the query parameters
    formObject.lead_id = urlParams.get('lead_id') || null; // Null if not available

    try {
        // Fetch geolocation details using ipgeolocation.io API
        const geoResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=7c74069e88c34bc7aa7ce737933abf70`);
        const geoData = await geoResponse.json();

        // Add geolocation data to the form object
        formObject.ip_address = geoData.ip;
        formObject.city = geoData.city;
        formObject.region = geoData.state_prov; // State/Region
        formObject.postal_code = geoData.zipcode;
        formObject.country = geoData.country_name; // Country

        // Submit the form data
        const response = await fetch('https://hook.us2.make.com/ruqaaec1arl46re4o9teozvjwxkow4ez', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
        });

        if (response.ok) {
            // Show the success message
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('form-block').style.display = 'none';
            document.getElementById('Get-Started-Title').style.display = 'none';
        } else {
            // Show the error message on failure
            document.querySelector('#error-message').style.display = 'block';
        }
    } catch (error) {
        // Show the error message for network or API errors
        document.querySelector('#error-message').style.display = 'block';
        console.error('Form submission error:', error);
    }
});

// Helper function to generate _fbp
function generateFbp() {
    const subdomainIndex = 1; // Default subdomain index
    const creationTime = Math.floor(Date.now() / 1000); // Current Unix timestamp
    const randomNumber = Math.floor(Math.random() * 10000000000); // Random 10-digit number
    return `fb.${subdomainIndex}.${creationTime}.${randomNumber}`;
}

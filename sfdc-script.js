document.addEventListener('DOMContentLoaded', () => {

    // Reveal animations on scroll
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Add initial animation classes for Hero elements to trigger immediately
    const animateHero = () => {
        document.querySelectorAll('.hero .fade-in').forEach(el => {
            el.style.opacity = '1';
        });
        
        // Example logic for delayed fading if defined in CSS, 
        // Here we just make sure everything is visible if CSS fails
    };
    
    setTimeout(animateHero, 100);

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(7, 7, 11, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(7, 7, 11, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
});

// Form Handling
function handleFormSubmit(event) {
    event.preventDefault();
    
    let isValid = true;
    const form = document.getElementById('leadForm');
    const inputs = form.querySelectorAll('input, select');
    
    // Simple validation loop
    inputs.forEach(input => {
        const value = input.value.trim();
        const formGroup = input.closest('.form-group');
        
        if (input.hasAttribute('required') && !value) {
            formGroup.classList.add('has-error');
            isValid = false;
        } else {
            formGroup.classList.remove('has-error');
            
            // Email specific regex
            if (input.type === 'email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    formGroup.classList.add('has-error');
                    isValid = false;
                }
            }
        }
    });
    
    if (isValid) {
        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.spinner');
        
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        // Send data to Webhook
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch('https://api.trustsolar.in/webhook/sfdc-master-class', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            // Even if the response isn't strictly OK, we should prevent crashing
            // Sometimes n8n webhooks return 200 without ok flag correctly depending on config
            form.style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('There was an issue submitting your registration. Please try again.');
            btnText.style.display = 'inline-block';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        });
    }
    
    return false;
}

// Intercept Input to remove error messages when typing
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
    });
});

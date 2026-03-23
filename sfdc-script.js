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

// --- Countdown Timer Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Set timer to March 29, 2026 11:00:00
    const targetDate = new Date("March 29, 2026 11:00:00").getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');
    
    if (!daysEl) return; // Exit if timer not on page

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minsEl.innerText = "00";
            secsEl.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = days.toString().padStart(2, '0');
        hoursEl.innerText = hours.toString().padStart(2, '0');
        minsEl.innerText = minutes.toString().padStart(2, '0');
        secsEl.innerText = seconds.toString().padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
});

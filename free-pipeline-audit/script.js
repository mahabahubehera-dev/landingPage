document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auditForm');
  const fileInput = document.getElementById('csvExport');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');
  const successState = document.getElementById('successState');
  const downloadLink = document.getElementById('downloadLink');

  // Update file name display when a file is selected
  fileInput.addEventListener('change', (e) => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
      // Also apply a visual style on wrapper
      fileInput.parentElement.style.borderColor = 'var(--color-primary)';
      fileInput.parentElement.style.backgroundColor = '#EFF6FF';
    } else {
      fileNameDisplay.textContent = 'Click to upload CSV file';
      fileInput.parentElement.style.borderColor = 'var(--color-border)';
      fileInput.parentElement.style.backgroundColor = '#F8FAFC';
    }
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
    formMessage.textContent = '';
    
    // Set loading state
    submitBtn.classList.add('btn-loading');
    
    // Prepare FormData
    const formData = new FormData(form);
    
    try {
      // Endpoint provided: https://api.trustsolar.in/webhook/rev-ops-audit
      const response = await fetch('https://api.trustsolar.in/webhook/rev-ops-audit', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      // Check for pdf_url (n8n standard format) or camelCase variations
      let pdfUrl = result.pdf_url || result.pdfUrl || result.url || result.fileUrl || '#';
      
      // If we received an OK response
      if (response.ok) {
        // Hide form, show success state
        form.style.display = 'none';
        successState.style.display = 'block';
        
        // Update the download link
        if (pdfUrl && pdfUrl !== '#') {
           downloadLink.href = pdfUrl;
        } else {
           // Fallback to downloading a dummy page if the API doesn't return a direct link
           downloadLink.href = 'pipeline_health_report.png';
        }
      } else {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }
      
    } catch (error) {
      // Display error
      formMessage.className = 'form-message error';
      formMessage.textContent = error.message || 'Failed to connect to the server. Please check your network or try again later.';
      formMessage.style.display = 'block';
    } finally {
      // Remove loading state
      submitBtn.classList.remove('btn-loading');
    }
  });
});

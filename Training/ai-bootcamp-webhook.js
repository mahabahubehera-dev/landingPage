document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enrollForm');
  if (!form) return;

  // Listen for enroll form submissions and forward a copy to the ai-bootcamp webhook
  form.addEventListener('submit', (e) => {
    try {
      // Build payload similar to existing handler
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.source = payload.source || 'salesforce-development-training';
      payload.submitted_at = new Date().toISOString();

      // Fire-and-forget POST to the ai-bootcamp webhook (does not block the original flow)
      fetch('https://api.trustsolar.in/webhook/ai-bootcamp', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => {
        // Fail silently but log for debugging
        console.warn('ai-bootcamp webhook delivery failed:', err);
      });
    } catch (err) {
      console.warn('ai-bootcamp forwarding error:', err);
    }
  });
});

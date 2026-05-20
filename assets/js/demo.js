// LeadaLine — Demo page JS (Vapi voice assistant)

document.addEventListener('DOMContentLoaded', () => {

  // ── Vapi floating widget ──────────────────────────────────────
  let vapiWidget = null;
  const callBtn   = document.getElementById('callBtn');
  const callLabel = document.getElementById('callLabel');
  const callSub   = document.getElementById('callSub');

  function loadVapiSDK() {
    return new Promise(resolve => {
      if (window.vapiSDK) { resolve(window.vapiSDK); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
      s.defer = s.async = true;
      s.onload = () => resolve(window.vapiSDK);
      document.head.appendChild(s);
    });
  }

  async function initVapi() {
    try {
      const sdk = await loadVapiSDK();
      vapiWidget = sdk.run({
        apiKey:    CONFIG.VAPI_PUBLIC_KEY,
        assistant: CONFIG.VAPI_ASSISTANT_ID,
        config: {
          position: 'bottom-right',
          offset:   '24px',
          width:    '52px',
          height:   '52px',
          idle: {
            color:    '#06d6f0',
            type:     'pill',
            title:    'Talk to LeadaLine AI',
            subtitle: 'Voice demo — click to start',
          },
          loading: {
            color:    '#06d6f0',
            type:     'pill',
            title:    'Connecting…',
            subtitle: 'Please wait',
          },
          active: {
            color:    '#ef4444',
            type:     'pill',
            title:    'Call in progress',
            subtitle: 'Tap to end',
          },
        },
      });
    } catch (e) {
      console.warn('Vapi SDK failed to load:', e);
    }
  }

  // Custom call button wires into the Vapi widget trigger
  let callActive = false;
  if (callBtn) {
    callBtn.addEventListener('click', async () => {
      if (!vapiWidget) {
        // SDK not ready — init now
        await initVapi();
        if (!vapiWidget) return;
      }
      if (!callActive) {
        // Trigger the widget's start action by clicking its hidden button
        const widgetBtn = document.querySelector('[data-vapi-button]') || document.querySelector('.vapi-btn');
        if (widgetBtn) {
          widgetBtn.click();
        } else {
          // Fallback: tell user to use the floating button
          callLabel.textContent = 'Use the button in the bottom-right corner';
        }
        callBtn.classList.add('active');
        callBtn.innerHTML = '📵';
        callLabel.textContent = 'Tap to end the call';
        callSub.textContent = 'Speaking with LeadaLine AI…';
        callActive = true;
      } else {
        callBtn.classList.remove('active');
        callBtn.innerHTML = '🎙️';
        callLabel.textContent = 'Click to start a voice conversation';
        callSub.textContent = 'Talk to the LeadaLine AI assistant';
        callActive = false;
      }
    });
  }

  // Load Vapi on page load (pre-warm connection)
  initVapi();

  // ── Suggested question answers ────────────────────────────────
  const answers = {
    'what-does':       '<strong>LeadaLine</strong> helps service businesses capture and respond to customer enquiries automatically. When someone enquires, the system qualifies the customer, organises the details, sends the owner a clear summary and tracks the lead in a simple dashboard.',
    'how-help':        'LeadaLine means fewer enquiries get missed. Customers get a faster response, owners get clear lead summaries rather than messy inboxes, and every enquiry is tracked from first contact through to booked work.',
    'not-chatbot':     'No. A chatbot usually just answers questions. LeadaLine is a full lead-response system. It captures enquiries, qualifies customers, sends owner summaries and tracks leads from new enquiry to booked work.',
    'existing-site':   'Yes — in most cases LeadaLine can connect to an existing website. If the current site is weak or does not convert well, LeadaLine may recommend a dedicated landing page or an improved enquiry flow.',
    'pilot':           'The pilot is a 3-month setup where LeadaLine installs the full system for your business: AI assistant, qualification flow, CRM/dashboard, email and SMS alerts. You see exactly how it performs before committing long term.',
    'book-demo':       'The simplest next step is to <a href="book-a-demo.html" style="color:var(--accent)">book a demo call</a>. We\'ll review your current enquiry process, show how the Lead Engine works and explain what a setup could look like for your business. No pressure.',
  };

  document.querySelectorAll('.sq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.q;
      const panel = document.getElementById('sqAnswer');
      if (!panel || !answers[key]) return;
      panel.innerHTML = `<p style="color:var(--text-secondary);font-size:0.9375rem;line-height:1.8">${answers[key]}</p>`;
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      // Highlight active button
      document.querySelectorAll('.sq-btn').forEach(b => b.style.borderColor = '');
      btn.style.borderColor = 'var(--accent)';
    });
  });

});

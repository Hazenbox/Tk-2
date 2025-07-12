// TRIKONANTARA CONTACT FORM - STAFF ENGINEER SOLUTION
// Sends emails directly to upendra1899@gmail.com inbox

class ContactFormHandler {
  constructor() {
    this.isSubmitting = false;
    this.targetEmail = 'contactus@trikonantara.com';
    this.emailjsConfig = {
      serviceId: 'service_trikonantara',
      templateId: 'template_trikonantara',
      publicKey: 'vDLYKPvEihy-jdJbB' // EmailJS public key
    };
    this.init();
  }

  init() {
    console.log('🚀 Contact Form Handler Ready - Staff Engineer Edition');
    this.initializeEmailJS();
    this.setupFormHandling();
    this.styleSendMessageButton();
  }

  async initializeEmailJS() {
    // Wait for EmailJS to load
    let attempts = 0;
    while (typeof emailjs === 'undefined' && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (typeof emailjs !== 'undefined') {
      try {
        emailjs.init(this.emailjsConfig.publicKey);
        console.log('✅ EmailJS initialized successfully');
      } catch (error) {
        console.log('❌ EmailJS initialization failed:', error);
      }
    }
  }

  setupFormHandling() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (button && this.isSendMessageButton(button)) {
        e.preventDefault();
        this.handleFormSubmission(button);
      }
    });
  }

  isSendMessageButton(button) {
    const text = button.textContent || button.innerText || '';
    return text.toLowerCase().includes('send message') || 
           text.toLowerCase().includes('send');
  }

  async handleFormSubmission(button) {
    if (this.isSubmitting) return;
    
    const data = this.extractFormData();
    
    if (!data.name || !data.email || !data.message) {
      this.showError('Please fill in all required fields.');
      return;
    }

    if (!this.isValidEmail(data.email)) {
      this.showError('Please enter a valid email address.');
      return;
    }

    this.isSubmitting = true;
    this.showLoadingState(button);

    try {
      // Send email directly to inbox
      await this.sendDirectEmail(data);
      
      // Show success message
      this.showSuccessMessage(data);
      
      // Clear form
      this.clearForm();
      
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      this.showError('Failed to send message. Please try again.');
    } finally {
      this.isSubmitting = false;
      this.hideLoadingState(button);
    }
  }

  extractFormData() {
    const nameInput = document.querySelector('input[name="name"], input[placeholder*="name" i], input[placeholder*="Name"]');
    const emailInput = document.querySelector('input[name="email"], input[type="email"], input[placeholder*="email" i]');
    const messageInput = document.querySelector('textarea[name="message"], textarea[placeholder*="message" i], textarea[placeholder*="Message"]');

    return {
      name: nameInput ? nameInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      message: messageInput ? messageInput.value.trim() : ''
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async sendDirectEmail(data) {
    // Method 1: Try EmailJS for direct sending
    if (typeof emailjs !== 'undefined') {
      try {
        console.log('📧 Sending email directly via EmailJS...');
        
        const templateParams = {
          to_email: this.targetEmail,
          from_name: data.name,
          from_email: data.email,
          message: data.message,
          subject: `Contact Form: ${data.name}`,
          reply_to: data.email
        };
        
        const response = await emailjs.send(
          this.emailjsConfig.serviceId,
          this.emailjsConfig.templateId,
          templateParams
        );
        
        console.log('✅ Email sent successfully via EmailJS:', response);
        return;
      } catch (error) {
        console.log('❌ EmailJS failed:', error);
        // Continue to fallback methods
      }
    }
    
    // Method 2: Try FormSubmit.co (No API key required)
    try {
      console.log('📧 Trying FormSubmit.co service...');
      
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('message', data.message);
      formData.append('_subject', `Contact Form: ${data.name}`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      formData.append('_next', 'https://trikonantara.com/thank-you');
      
      const response = await fetch(`https://formsubmit.co/${this.targetEmail}`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        console.log('✅ Email sent successfully via FormSubmit.co');
        return;
      } else {
        throw new Error('FormSubmit.co failed');
      }
    } catch (error) {
      console.log('❌ FormSubmit.co failed:', error);
      // Continue to final fallback
    }
    
    // Method 3: Try Formspree
    try {
      console.log('📧 Trying Formspree service...');
      
      const response = await fetch('https://formspree.io/f/xvgpkjqr', { // Replace with your Formspree endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          _replyto: data.email,
          _subject: `Contact Form: ${data.name}`
        })
      });
      
      if (response.ok) {
        console.log('✅ Email sent successfully via Formspree');
        return;
      } else {
        throw new Error('Formspree failed');
      }
    } catch (error) {
      console.log('❌ Formspree failed:', error);
    }
    
    // If all methods fail, throw error
    throw new Error('All email sending methods failed');
  }

  showSuccessMessage(data) {
    const formContainer = this.findFormContainer();
    
    if (formContainer) {
      formContainer.style.display = 'none';
      
      const successDiv = document.createElement('div');
      successDiv.className = 'contact-success-message';
      successDiv.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; font-family: 'Fustat', sans-serif;">
          <div style="margin-bottom: 20px;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="color: #10B981; margin: 0 auto; display: block;">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <h3 style="color: #5c0601; font-family: 'Funnel Display', sans-serif; font-size: 24px; font-weight: 600; margin-bottom: 16px;">
            Message Sent!
          </h3>
          
          <p style="color: #1a1a1a; font-size: 16px; line-height: 1.5; margin: 0;">
            Your message has been sent successfully.<br>
            We'll get back to you soon at <strong style="color: #5c0601;">${data.email}</strong>
          </p>
        </div>
      `;
      
      formContainer.parentElement.insertBefore(successDiv, formContainer.nextSibling);
      console.log('✅ Success message displayed');
    } else {
      this.showNotification('Message sent successfully!', 'success');
    }
  }

  findFormContainer() {
    const nameInput = document.querySelector('input[name="name"], input[placeholder*="name" i], input[placeholder*="Name"]');
    const emailInput = document.querySelector('input[name="email"], input[type="email"], input[placeholder*="email" i]');
    const messageInput = document.querySelector('textarea[name="message"], textarea[placeholder*="message" i], textarea[placeholder*="Message"]');
    
    if (nameInput && emailInput && messageInput) {
      let container = nameInput.closest('form');
      
      if (!container) {
        container = nameInput.closest('div');
        while (container && (!container.contains(emailInput) || !container.contains(messageInput))) {
          container = container.parentElement;
        }
      }
      
      return container;
    }
    
    return null;
  }

  clearForm() {
    const nameInput = document.querySelector('input[name="name"], input[placeholder*="name" i], input[placeholder*="Name"]');
    const emailInput = document.querySelector('input[name="email"], input[type="email"], input[placeholder*="email" i]');
    const messageInput = document.querySelector('textarea[name="message"], textarea[placeholder*="message" i], textarea[placeholder*="Message"]');

    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (messageInput) messageInput.value = '';
  }

  showLoadingState(button) {
    button.disabled = true;
    button.style.opacity = '0.7';
    button.setAttribute('data-original-text', button.textContent);
    button.textContent = 'Sending...';
  }

  hideLoadingState(button) {
    button.disabled = false;
    button.style.opacity = '1';
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
      button.textContent = originalText;
      button.removeAttribute('data-original-text');
    }
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.contact-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `contact-notification contact-notification-${type}`;
    notification.textContent = message;
    
    const backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 20px;
      border-radius: 8px;
      color: white;
      font-family: 'Fustat', sans-serif;
      font-weight: 500;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      background-color: ${backgroundColor};
      animation: slideIn 0.3s ease-out;
    `;

    if (!document.querySelector('#contact-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'contact-notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  styleSendMessageButton() {
    const styleSendButtons = () => {
      const buttons = document.querySelectorAll('button');
      
      buttons.forEach(button => {
        if (this.isSendMessageButton(button)) {
          button.style.setProperty('background-color', '#5c0601', 'important');
          button.style.setProperty('color', 'white', 'important');
          button.style.setProperty('border-color', '#5c0601', 'important');
          
          const children = button.querySelectorAll('*');
          children.forEach(child => {
            child.style.setProperty('color', 'white', 'important');
          });
          
          button.addEventListener('mouseenter', () => {
            if (!button.disabled) {
              button.style.setProperty('background-color', '#4a0501', 'important');
            }
          });
          
          button.addEventListener('mouseleave', () => {
            if (!button.disabled) {
              button.style.setProperty('background-color', '#5c0601', 'important');
            }
          });
        }
      });
    };

    styleSendButtons();
    setInterval(styleSendButtons, 1000);
  }
}

// Initialize
console.log('🚀 Initializing Contact Form Handler...');
const contactFormHandler = new ContactFormHandler(); 
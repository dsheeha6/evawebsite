// Forms JavaScript for Eva Sheehan Portfolio
// Handles contact form validation, submission, and API integration

class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton ? this.submitButton.textContent : 'Send Message';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupValidation();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    setupValidation() {
        // Add required attributes and validation patterns
        const nameInput = this.form.querySelector('input[name="name"]');
        const emailInput = this.form.querySelector('input[name="email"]');
        const messageInput = this.form.querySelector('textarea[name="message"]');
        
        if (nameInput) {
            nameInput.setAttribute('required', '');
            nameInput.setAttribute('minlength', '2');
            nameInput.setAttribute('maxlength', '100');
        }
        
        if (emailInput) {
            emailInput.setAttribute('required', '');
            emailInput.setAttribute('type', 'email');
            emailInput.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
        }
        
        if (messageInput) {
            messageInput.setAttribute('required', '');
            messageInput.setAttribute('minlength', '10');
            messageInput.setAttribute('maxlength', '1000');
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Length validation
        if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
            isValid = false;
            errorMessage = `Minimum length is ${field.getAttribute('minlength')} characters`;
        }
        
        if (field.hasAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
            isValid = false;
            errorMessage = `Maximum length is ${field.getAttribute('maxlength')} characters`;
        }
        
        // Show/hide error
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;
        
        // Insert error message after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Check honeypot
        const honeypot = this.form.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) {
            console.warn('Honeypot field filled - potential spam');
            return false;
        }
        
        return isValid;
    }
    
    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            const formData = this.getFormData();
            const response = await this.submitForm(formData);
            
            if (response.ok) {
                this.showSuccess();
                this.resetForm();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Sorry, there was an error sending your message. Please try again or contact us directly.');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            // Skip honeypot field
            if (key === 'website') continue;
            data[key] = value.trim();
        }
        
        // Add timestamp and user agent for security
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        
        return data;
    }
    
    async submitForm(data) {
        const apiUrl = '/api/contact';
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            return response;
        } catch (error) {
            throw new Error('Network error: ' + error.message);
        }
    }
    
    setLoadingState(loading) {
        if (this.submitButton) {
            if (loading) {
                this.submitButton.disabled = true;
                this.submitButton.textContent = 'Sending...';
                this.submitButton.classList.add('loading');
            } else {
                this.submitButton.disabled = false;
                this.submitButton.textContent = this.originalButtonText;
                this.submitButton.classList.remove('loading');
            }
        }
    }
    
    showSuccess() {
        // Remove existing messages
        this.clearMessages();
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-message success';
        successMessage.innerHTML = `
            <div style="
                background: #f0fdf4;
                border: 1px solid #22c55e;
                color: #166534;
                padding: 1rem;
                border-radius: var(--radius);
                margin-top: 1rem;
                text-align: center;
            ">
                <strong>Thank you!</strong> Your message has been sent successfully. 
                We'll get back to you within 24 hours.
            </div>
        `;
        
        this.form.appendChild(successMessage);
        
        // Scroll to message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 10000);
    }
    
    showError(message) {
        // Remove existing messages
        this.clearMessages();
        
        // Create error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-message error';
        errorMessage.innerHTML = `
            <div style="
                background: #fef2f2;
                border: 1px solid #ef4444;
                color: #991b1b;
                padding: 1rem;
                border-radius: var(--radius);
                margin-top: 1rem;
                text-align: center;
            ">
                <strong>Error:</strong> ${message}
            </div>
        `;
        
        this.form.appendChild(errorMessage);
        
        // Scroll to message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    clearMessages() {
        const messages = this.form.querySelectorAll('.form-message');
        messages.forEach(message => message.remove());
    }
    
    resetForm() {
        this.form.reset();
        
        // Clear any custom styling
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.classList.remove('error');
        });
        
        // Clear any remaining error messages
        this.clearMessages();
    }
}

// Form validation utilities
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    static validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    static sanitizeInput(input) {
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, ''); // Remove event handlers
    }
}

// Auto-save form data to localStorage
class FormAutoSave {
    constructor(formId, fields = []) {
        this.form = document.getElementById(formId);
        this.fields = fields;
        this.storageKey = `form_${formId}_autosave`;
        
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.loadSavedData();
        this.bindEvents();
    }
    
    bindEvents() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveData();
            });
        });
        
        // Clear saved data on successful submission
        this.form.addEventListener('submit', () => {
            this.clearSavedData();
        });
    }
    
    saveData() {
        const data = {};
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.name && input.value) {
                data[input.name] = input.value;
            }
        });
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Could not save form data to localStorage:', error);
        }
    }
    
    loadSavedData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field && !field.value) {
                        field.value = data[key];
                    }
                });
            }
        } catch (error) {
            console.warn('Could not load saved form data:', error);
        }
    }
    
    clearSavedData() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.warn('Could not clear saved form data:', error);
        }
    }
}

// Initialize forms when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    const contactForm = new ContactForm('contactForm');
    
    // Initialize auto-save for contact form
    if (document.getElementById('contactForm')) {
        new FormAutoSave('contactForm');
    }
    
    // Add form styling for error states
    const style = document.createElement('style');
    style.textContent = `
        .form-field input.error,
        .form-field textarea.error,
        .form-field select.error {
            border-color: #dc2626;
            box-shadow: 0 0 0 1px #dc2626;
        }
        
        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(22, 59, 96, 0.2);
        }
        
        .btn.loading {
            position: relative;
            color: transparent;
        }
        
        .btn.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// Export classes for potential external use
window.ContactForm = ContactForm;
window.FormValidator = FormValidator;
window.FormAutoSave = FormAutoSave;

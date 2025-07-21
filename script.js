// Contact Class
class Contact {
    constructor(firstName, lastName, email, phone, address, about, isEmergency = false) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.about = about;
        this.isEmergency = isEmergency;
        this.id = Date.now().toString();
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

// AddressBook Class
class AddressBook {
    constructor() {
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    addContact(contact) {
        this.contacts.push(contact);
        this.saveContacts();
    }

    deleteContact(id) {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
        this.saveContacts();
    }

    getContacts() {
        return this.contacts;
    }

    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    searchContacts(query) {
        if (!query) return this.contacts;
        
        query = query.toLowerCase();
        return this.contacts.filter(contact => {
            return contact.firstName.toLowerCase().includes(query) ||
                   contact.lastName.toLowerCase().includes(query) ||
                   contact.email.toLowerCase().includes(query) ||
                   contact.phone.toLowerCase().includes(query) ||
                   contact.address.toLowerCase().includes(query);
        });
    }
}

// UI Handler
class UI {
    constructor() {
        this.addressBook = new AddressBook();
        this.initializeApp();
    }

    initializeApp() {
        // Show loading animation
        this.showLoading();

        // Initialize event listeners after a short delay
        setTimeout(() => {
            this.hideLoading();
            this.bindEvents();
            this.setupThemeSwitch();
        }, 1000);
    }

    showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loading-container';
        loader.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading your contacts...</div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoading() {
        const loader = document.querySelector('.loading-container');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
                const main = document.querySelector('main');
                if (main) main.classList.add('fade-in');
            }, 500);
        }
    }

    bindEvents() {
        // Add Contact Form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddContact();
            });
            
            // Add input validation and enhanced styling
            const formInputs = contactForm.querySelectorAll('input, textarea');
            formInputs.forEach(input => {
                // Add focus effects
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    input.parentElement.classList.remove('focused');
                    
                    // Simple validation
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        input.classList.add('invalid');
                        input.parentElement.classList.add('error');
                    } else {
                        input.classList.remove('invalid');
                        input.parentElement.classList.remove('error');
                    }
                });
                
                // Live validation
                input.addEventListener('input', () => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        input.classList.add('invalid');
                    } else {
                        input.classList.remove('invalid');
                        input.parentElement.classList.remove('error');
                    }
                });
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.handleSearch(searchInput.value);
            });
        }

        // View Contacts
        const contactsList = document.getElementById('contactsList');
        if (contactsList) {
            this.displayContacts();
        }
    }

    setupThemeSwitch() {
        // Check if theme switcher already exists to prevent duplicates
        if (document.querySelector('.theme-switcher')) {
            return;
        }
        
        // Check if theme already exists in localStorage or use default dark theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        
        // Apply the saved theme to html element
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Create theme switcher button
        const themeSwitcher = document.createElement('button');
        themeSwitcher.className = 'theme-switcher';
        themeSwitcher.id = 'theme-switcher';
        themeSwitcher.setAttribute('aria-label', `Switch to ${savedTheme === 'dark' ? 'light' : 'dark'} mode`);
        
        // Set icon based on current theme
        themeSwitcher.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        
        // Add click event to toggle theme
        themeSwitcher.addEventListener('click', () => {
            // Get current theme
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            // Toggle theme
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Update HTML attribute
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Update button icon
            themeSwitcher.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            themeSwitcher.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
        });
        
        // Add the button to the body
        document.body.appendChild(themeSwitcher);
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Show notification with animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto close after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    handleAddContact() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address')?.value || '';
        const about = document.getElementById('notes')?.value || '';
        const isEmergency = document.getElementById('isEmergency') ? document.getElementById('isEmergency').checked : false;

        // Form validation
        if (!firstName || !lastName || !phone) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const contact = new Contact(
            firstName,
            lastName,
            email,
            phone,
            address,
            about,
            isEmergency
        );

        // Show saving animation
        this.showSavingIndicator();

        // Simulate saving delay for better UX
        setTimeout(() => {
            this.addressBook.addContact(contact);
            this.showNotification('Contact added successfully!');
            setTimeout(() => {
                window.location.href = isEmergency ? 'emergency-contacts.html' : 'view.html';
            }, 1000);
        }, 800);
    }

    showSavingIndicator() {
        const form = document.getElementById('contactForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="button-spinner"></div>
            <span>Saving...</span>
        `;
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    }

    handleSearch(query) {
        const filteredContacts = this.addressBook.searchContacts(query);
        this.displayFilteredContacts(filteredContacts);
    }

    displayFilteredContacts(contacts) {
        const contactsList = document.getElementById('contactsList');
        
        // Check if we're on the emergency contacts page
        const isEmergencyPage = window.location.pathname.includes('emergency-contacts.html');
        
        // Filter contacts based on page type
        const filteredContacts = isEmergencyPage 
            ? contacts.filter(contact => contact.isEmergency) 
            : contacts;
        
        if (filteredContacts.length === 0) {
            contactsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p class="empty-state-text">No ${isEmergencyPage ? 'emergency ' : ''}contacts found</p>
                    <a href="${isEmergencyPage ? 'add-emergency.html' : 'add.html'}" class="primary-button">Add New Contact</a>
                </div>
            `;
            return;
        }

        // Different display for emergency vs regular contacts
        if (isEmergencyPage) {
            contactsList.innerHTML = filteredContacts.map(contact => `
                <div class="contact-card emergency-contact" data-id="${contact.id}">
                    <span class="emergency-badge">Emergency</span>
                    <div class="contact-info">
                        <h3>${contact.firstName} ${contact.lastName}</h3>
                        <p><i class="fas fa-phone icon"></i> <a href="tel:${contact.phone}">${contact.phone}</a></p>
                    </div>
                    <div class="contact-actions">
                        <button class="call-button" onclick="window.location.href='tel:${contact.phone}'">
                            <i class="fas fa-phone"></i> Call Now
                        </button>
                        <button class="delete-button" onclick="ui.deleteContact('${contact.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            // Regular contacts with all fields
            contactsList.innerHTML = filteredContacts.map(contact => `
                <div class="contact-card ${contact.isEmergency ? 'emergency-contact' : ''}" data-id="${contact.id}">
                    ${contact.isEmergency ? '<span class="emergency-badge">Emergency</span>' : ''}
                    <div class="contact-info">
                        <h3>${contact.firstName} ${contact.lastName}</h3>
                        <p><i class="fas fa-envelope icon"></i> <a href="mailto:${contact.email}">${contact.email || 'N/A'}</a></p>
                        <p><i class="fas fa-phone icon"></i> <a href="tel:${contact.phone}">${contact.phone}</a></p>
                        <p><i class="fas fa-map-marker-alt icon"></i> ${contact.address || 'N/A'}</p>
                    </div>
                    <div class="contact-actions">
                        <button class="view-button" onclick="ui.viewContact('${contact.id}')">View</button>
                        <button class="delete-button" onclick="ui.deleteContact('${contact.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }

    displayContacts() {
        const contacts = this.addressBook.getContacts();
        const contactsList = document.getElementById('contactsList');
        
        // Check if we're on the emergency contacts page
        const isEmergencyPage = window.location.pathname.includes('emergency-contacts.html');
        
        // Filter contacts based on page type
        const filteredContacts = isEmergencyPage 
            ? contacts.filter(contact => contact.isEmergency) 
            : contacts;
        
        if (filteredContacts.length === 0) {
            contactsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">${isEmergencyPage ? '🚨' : '📋'}</div>
                    <p class="empty-state-text">No ${isEmergencyPage ? 'emergency ' : ''}contacts available yet</p>
                    <a href="${isEmergencyPage ? 'add-emergency.html' : 'add.html'}" class="primary-button">Add Your First Contact</a>
                </div>
            `;
            return;
        }

        // Different display for emergency vs regular contacts
        if (isEmergencyPage) {
            contactsList.innerHTML = filteredContacts.map(contact => `
                <div class="contact-card emergency-contact" data-id="${contact.id}">
                    <span class="emergency-badge">Emergency</span>
                    <div class="contact-info">
                        <h3>${contact.firstName} ${contact.lastName}</h3>
                        <p><i class="fas fa-phone icon"></i> <a href="tel:${contact.phone}">${contact.phone}</a></p>
                    </div>
                    <div class="contact-actions">
                        <button class="call-button" onclick="window.location.href='tel:${contact.phone}'">
                            <i class="fas fa-phone"></i> Call Now
                        </button>
                        <button class="delete-button" onclick="ui.deleteContact('${contact.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            // Regular contacts with all fields
            contactsList.innerHTML = filteredContacts.map(contact => `
                <div class="contact-card ${contact.isEmergency ? 'emergency-contact' : ''}" data-id="${contact.id}">
                    ${contact.isEmergency ? '<span class="emergency-badge">Emergency</span>' : ''}
                    <div class="contact-info">
                        <h3>${contact.firstName} ${contact.lastName}</h3>
                        <p><i class="fas fa-envelope icon"></i> <a href="mailto:${contact.email}">${contact.email || 'N/A'}</a></p>
                        <p><i class="fas fa-phone icon"></i> <a href="tel:${contact.phone}">${contact.phone}</a></p>
                        <p><i class="fas fa-map-marker-alt icon"></i> ${contact.address || 'N/A'}</p>
                    </div>
                    <div class="contact-actions">
                        <button class="view-button" onclick="ui.viewContact('${contact.id}')">View</button>
                        <button class="delete-button" onclick="ui.deleteContact('${contact.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        // Initialize modal functionality
        const modal = document.getElementById('contactModal');
        if (modal) {
            const closeButton = document.querySelector('.close-button');
            if (closeButton) {
                closeButton.onclick = () => {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = "none";
                    }, 300);
                }
            }

            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = "none";
                    }, 300);
                }
            }
        }
    }

    viewContact(id) {
        const contact = this.addressBook.contacts.find(c => c.id === id);
        const modal = document.getElementById('contactModal');
        const isEmergencyPage = window.location.pathname.includes('emergency-contacts.html');
        
        if (!modal) return;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // Simplified emergency contact modal
        if (contact.isEmergency && isEmergencyPage) {
            modalContent.innerHTML = `
                <span class="close-button">&times;</span>
                <div class="modal-header">
                    <h2>${contact.firstName} ${contact.lastName}</h2>
                    <span class="emergency-badge">Emergency</span>
                </div>
                <div class="contact-details">
                    <div class="detail-group">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${contact.phone}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="secondary-button" onclick="ui.closeModal()">Close</button>
                    <button class="call-button" onclick="window.location.href='tel:${contact.phone}'">
                        <i class="fas fa-phone"></i> Call Now
                    </button>
                </div>
            `;
        } else {
            // Regular contact modal with all fields
            modalContent.innerHTML = `
                <span class="close-button">&times;</span>
                <div class="modal-header">
                    <h2>${contact.firstName} ${contact.lastName}</h2>
                    ${contact.isEmergency ? '<span class="emergency-badge">Emergency</span>' : ''}
                </div>
                <div class="contact-details">
                    <div class="detail-group">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${contact.email || 'Not provided'}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${contact.phone}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${contact.address || 'Not provided'}</span>
                    </div>
                    ${contact.about ? `
                    <div class="detail-group">
                        <span class="detail-label">Notes</span>
                        <span class="detail-value">${contact.about}</span>
                    </div>` : ''}
                </div>
                <div class="modal-actions">
                    <button class="secondary-button" onclick="ui.closeModal()">Close</button>
                    <button class="delete-button" onclick="ui.deleteContact('${contact.id}', true)">Delete</button>
                </div>
            `;
        }
        
        modal.innerHTML = '';
        modal.appendChild(modalContent);
        modal.style.display = "block";
        
        setTimeout(() => {
            modal.classList.add('show');
            modalContent.classList.add('show');
        }, 10);
        
        const closeBtn = modalContent.querySelector('.close-button');
        closeBtn.addEventListener('click', () => this.closeModal());
    }

    closeModal() {
        const modal = document.getElementById('contactModal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    deleteContact(id, isModal = false) {
        // Show confirmation dialog
        if (confirm('Are you sure you want to delete this contact?')) {
            this.addressBook.deleteContact(id);
            
            if (isModal) {
                this.closeModal();
            }
            
            this.showNotification('Contact deleted successfully');
            this.displayContacts();
        }
    }
}

// Initialize the UI
const ui = new UI(); 
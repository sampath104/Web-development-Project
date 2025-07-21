// Emergency Contacts Management System
const emergencyDB = 'emergencyContacts';

// Initialize emergency contacts database
function initEmergencyDB() {
    let contacts = localStorage.getItem(emergencyDB);
    if (!contacts) {
        localStorage.setItem(emergencyDB, JSON.stringify([]));
    }
}

// Add emergency contact with only name and phone number
function addEmergencyContact(name, phoneNumber) {
    if (!name || !phoneNumber) {
        alert('Please fill in all required fields');
        return false;
    }

    // Validate phone number
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert('Please enter a valid phone number');
        return false;
    }

    const contacts = JSON.parse(localStorage.getItem(emergencyDB) || '[]');
    const newContact = {
        id: Date.now(),
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        createdAt: new Date().toISOString()
    };

    contacts.push(newContact);
    localStorage.setItem(emergencyDB, JSON.stringify(contacts));
    return true;
}

// Get all emergency contacts
function getEmergencyContacts() {
    return JSON.parse(localStorage.getItem(emergencyDB) || '[]');
}

// Delete emergency contact
function deleteEmergencyContact(id) {
    let contacts = JSON.parse(localStorage.getItem(emergencyDB) || '[]');
    contacts = contacts.filter(contact => contact.id !== id);
    localStorage.setItem(emergencyDB, JSON.stringify(contacts));
}

// Initialize DB when script loads
initEmergencyDB();

// Apply theme on page load for emergency contacts
document.addEventListener('DOMContentLoaded', function() {
    // Apply saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Find existing theme button if it was created by script.js
    const existingThemeBtn = document.querySelector('#theme-switcher');
    if (!existingThemeBtn) {
        setupThemeSwitcher();
    }
    
    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // This will use the search function from script.js
            if (window.ui && typeof window.ui.handleSearch === 'function') {
                window.ui.handleSearch(searchInput.value);
            }
        });
    }
});

function setupThemeSwitcher() {
    // Set up theme switcher if not already done by script.js
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    const themeSwitcher = document.createElement('button');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.id = 'theme-switcher';
    themeSwitcher.setAttribute('aria-label', `Switch to ${savedTheme === 'dark' ? 'light' : 'dark'} mode`);
    
    // Set icon based on current theme
    themeSwitcher.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    
    // Add click event to toggle theme
    themeSwitcher.addEventListener('click', function() {
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
    
    // Add the button to the body if it doesn't exist yet
    if (!document.querySelector('.theme-switcher')) {
        document.body.appendChild(themeSwitcher);
    }
} 
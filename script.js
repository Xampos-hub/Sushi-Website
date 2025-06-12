// Language functionality
let currentLanguage = 'en';

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en][data-gr]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                if (element.placeholder) {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update menu language for dynamically loaded content
    if (typeof updateMenuLanguage === 'function') {
        updateMenuLanguage(lang);
    }
}

// Language toggle event listeners
document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
document.getElementById('lang-gr').addEventListener('click', () => switchLanguage('gr'));

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Fallback για browsers που δεν υποστηρίζουν smooth behavior
            if ('scrollBehavior' in document.documentElement.style) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // Fallback για παλιότερους browsers
                target.scrollIntoView();
            }
        }
    });
});

// Menu filtering
const categoryBtns = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        
        menuItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);


// Load contact data from GitHub or localStorage
async function loadContactData() {
    try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`https://raw.githubusercontent.com/Xamposs/Sushi-Website/main/contact-data.json?t=${timestamp}`);
        if (response.ok) {
            const contactData = await response.json();
            updateContactInfo(contactData);
            // Store in localStorage as backup
            localStorage.setItem('contactData', JSON.stringify(contactData));
            return;
        }
    } catch (error) {
        console.log('Loading from GitHub failed, trying localStorage...');
    }
    
    // Fallback to localStorage
    const savedData = localStorage.getItem('contactData');
    if (savedData) {
        const contactData = JSON.parse(savedData);
        updateContactInfo(contactData);
    }
}

// Auto-refresh contact data every 30 seconds
setInterval(loadContactData, 30000);

// Update contact information on the page
function updateContactInfo(contactData) {
    const currentLang = document.documentElement.lang || 'en';
    
    // Update address
    const addressElement = document.querySelector('[data-contact="address"]');
    if (addressElement && contactData.address) {
        addressElement.textContent = contactData.address[currentLang] || contactData.address.en;
    }
    
    // Update phone
    const phoneElement = document.querySelector('[data-contact="phone"]');
    if (phoneElement && contactData.phone) {
        phoneElement.textContent = contactData.phone[currentLang] || contactData.phone.en;
    }
    
    // Update email
    const emailElement = document.querySelector('[data-contact="email"]');
    if (emailElement && contactData.email) {
        emailElement.textContent = contactData.email[currentLang] || contactData.email.en;
    }
    
    // Update hours
    const hoursElement = document.querySelector('[data-contact="hours"]');
    if (hoursElement && contactData.hours) {
        hoursElement.textContent = contactData.hours[currentLang] || contactData.hours.en;
    }
    
    // Update map title
    const mapTitleElement = document.querySelector('[data-contact="map-title"]');
    if (mapTitleElement && contactData.mapTitle) {
        mapTitleElement.textContent = contactData.mapTitle[currentLang] || contactData.mapTitle.en;
    }
    
    // Update map description
    const mapDescElement = document.querySelector('[data-contact="map-description"]');
    if (mapDescElement && contactData.mapDescription) {
        mapDescElement.textContent = contactData.mapDescription[currentLang] || contactData.mapDescription.en;
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    loadContactData();
});

// Update switchLanguage function to reload contact data
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en][data-gr]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                if (element.placeholder) {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update menu language for dynamically loaded content
    if (typeof updateMenuLanguage === 'function') {
        updateMenuLanguage(lang);
    }
    
    // Reload contact data for new language
    loadContactData();
}

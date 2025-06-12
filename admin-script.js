// Admin Panel JavaScript
let menuData = {};
let contactData = {};
let currentCategory = 'sushi';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'sushi123';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadContactData();
});

// Load menu data from JSON
async function loadMenuData() {
    try {
        const response = await fetch('menu-data.json');
        menuData = await response.json();
        displayMenuItems(currentCategory);
    } catch (error) {
        console.error('Error loading menu data:', error);
        alert('Error loading menu data. Please check if menu-data.json exists.');
    }
}

// Load contact data from JSON
async function loadContactData() {
    try {
        const response = await fetch('contact-data.json');
        contactData = await response.json();
        // Γραμμή 31:
        populateContactForm(contactData);
        
        // Γραμμή 39:
        populateContactForm(contactData);
    } catch (error) {
        console.error('Error loading contact data:', error);
        
        // Try to load from localStorage
        const savedData = localStorage.getItem('contactData');
        if (savedData) {
            contactData = JSON.parse(savedData);
            populateContactForm();
        } else {
            contactData = {
                address: { en: "", gr: "" },
                phone: { en: "", gr: "" },    // ← Διόρθωση
                email: { en: "", gr: "" },    // ← Διόρθωση
                hours: { en: "", gr: "" },
                mapTitle: { en: "Find Us in Athens", gr: "Βρείτε μας στην Αθήνα" },
                mapDescription: { en: "", gr: "" }
            };
        }
    }
}

// Login function
function login() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadMenuData();
        showNotification('Επιτυχής σύνδεση!', 'success');
    } else {
        showNotification('Λάθος στοιχεία σύνδεσης!', 'error');
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
    }
}

// Logout function
function logout() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('admin-password').value = '';
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to clicked nav item
    event.target.classList.add('active');
    
    // Load data based on section
    if (sectionName === 'menu') {
        loadMenuData();
    } else if (sectionName === 'contact') {
        loadContactData();
    }
}

// Show category
function showCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayMenuItems(category);
}

// Display menu items for a category
function displayMenuItems(category) {
    const container = document.getElementById('menu-items-container');
    const items = menuData[category] || [];
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-utensils"></i>
                <h3>Δεν υπάρχουν προϊόντα σε αυτή την κατηγορία</h3>
                <p>Κάντε κλικ στο "Add New Item" για να προσθέσετε το πρώτο προϊόν.</p>
            </div>
        `;
        return;
    }
    
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item-card';
        itemDiv.innerHTML = `
            <div class="item-header">
                <div class="item-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="item-info">
                    <h3>${item.name.en} / ${item.name.gr}</h3>
                    <div class="item-price">${item.price}</div>
                </div>
            </div>
            <div class="item-descriptions">
                <p><strong>EN:</strong> ${item.description.en}</p>
                <p><strong>GR:</strong> ${item.description.gr}</p>
            </div>
            <div class="item-actions">
                <button onclick="editItem('${category}', ${index})" class="btn btn-primary btn-sm">
                    <i class="fas fa-edit"></i> Επεξεργασία
                </button>
                <button onclick="removeItem('${category}', ${index})" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i> Διαγραφή
                </button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

// Edit item
function editItem(category, index) {
    const item = menuData[category][index];
    
    document.getElementById('item-id').value = index;
    document.getElementById('item-category').value = category;
    document.getElementById('name-en').value = item.name.en;
    document.getElementById('name-gr').value = item.name.gr;
    document.getElementById('description-en').value = item.description.en;
    document.getElementById('description-gr').value = item.description.gr;
    document.getElementById('price').value = item.price;
    document.getElementById('icon').value = item.icon;
    
    document.getElementById('edit-modal').style.display = 'block';
}

// Add new item
function addNewItem() {
    document.getElementById('item-id').value = -1; // -1 indicates new item
    document.getElementById('item-category').value = currentCategory;
    document.getElementById('name-en').value = '';
    document.getElementById('name-gr').value = '';
    document.getElementById('description-en').value = '';
    document.getElementById('description-gr').value = '';
    document.getElementById('price').value = '';
    document.getElementById('icon').value = 'fas fa-utensils';
    
    document.getElementById('edit-modal').style.display = 'block';
}

// Save item
function saveItem() {
    const index = parseInt(document.getElementById('item-id').value);
    const category = document.getElementById('item-category').value;
    
    const item = {
        id: generateId(),
        name: {
            en: document.getElementById('name-en').value,
            gr: document.getElementById('name-gr').value
        },
        description: {
            en: document.getElementById('description-en').value,
            gr: document.getElementById('description-gr').value
        },
        price: document.getElementById('price').value,
        icon: document.getElementById('icon').value
    };
    
    if (index === -1) {
        // Add new item
        if (!menuData[category]) {
            menuData[category] = [];
        }
        menuData[category].push(item);
    } else {
        // Update existing item
        menuData[category][index] = item;
    }
    
    displayMenuItems(category);
    closeModal();
    
    // Show success message
    showNotification('Το προϊόν αποθηκεύτηκε επιτυχώς!', 'success');
}

// Delete item
function deleteItem() {
    const index = parseInt(document.getElementById('item-id').value);
    const category = document.getElementById('item-category').value;
    
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν;')) {
        menuData[category].splice(index, 1);
        displayMenuItems(category);
        closeModal();
        showNotification('Το προϊόν διαγράφηκε επιτυχώς!', 'success');
    }
}

// Remove item (alternative delete function)
function removeItem(category, index) {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το προϊόν;')) {
        menuData[category].splice(index, 1);
        displayMenuItems(category);
        showNotification('Το προϊόν διαγράφηκε επιτυχώς!', 'success');
    }
}

// Populate contact form with existing data
function populateContactForm(contactData) {
    document.getElementById('address-en').value = contactData.address?.en || '';
    document.getElementById('address-gr').value = contactData.address?.gr || '';
    document.getElementById('phone').value = contactData.phone || '';        // ← ΣΩΣΤΟ!
    document.getElementById('email').value = contactData.email || '';        // ← ΣΩΣΤΟ!
    document.getElementById('hours-en').value = contactData.hours?.en || '';
    document.getElementById('hours-gr').value = contactData.hours?.gr || '';
    document.getElementById('map-title-en').value = contactData.mapTitle?.en || '';
    document.getElementById('map-title-gr').value = contactData.mapTitle?.gr || '';
    document.getElementById('map-desc-en').value = contactData.mapDescription?.en || '';
    document.getElementById('map-desc-gr').value = contactData.mapDescription?.gr || '';
}

// GitHub configuration
const GITHUB_CONFIG = {
    owner: 'Xamposs',        // Το σωστό GitHub username
    repo: 'Sushi-Website',   // Το όνομα του repository
    branch: 'main',
    filePath: 'contact-data.json'
};

// Save contact info to GitHub
async function saveContactInfo() {
    try {
        const contactData = {
            address: {
                en: document.getElementById('address-en').value,
                gr: document.getElementById('address-gr').value
            },
            phone: document.getElementById('phone').value,        // ← ΔΙΟΡΘΩΣΗ: αφαίρεση του object
            email: document.getElementById('email').value,        // ← ΔΙΟΡΘΩΣΗ: αφαίρεση του object
            hours: {
                en: document.getElementById('hours-en').value,
                gr: document.getElementById('hours-gr').value
            },
            mapTitle: {
                en: document.getElementById('map-title-en').value,
                gr: document.getElementById('map-title-gr').value
            },
            mapDescription: {
                en: document.getElementById('map-desc-en').value,
                gr: document.getElementById('map-desc-gr').value
            }
        };
        // ... existing code ...
        
        await saveContactInfoToGitHub(contactData);
        showNotification('Τα στοιχεία επικοινωνίας αποθηκεύτηκαν επιτυχώς στο GitHub!', 'success');
        
    } catch (error) {
        console.error('Error saving contact info:', error);
        showNotification('Σφάλμα κατά την αποθήκευση: ' + error.message, 'error');
    }
}

// Save to local file function
async function saveToLocalFile(data, filename) {
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.log('Local file save failed:', error);
    }
}

// Save contact info to GitHub repository
async function saveContactInfoToGitHub(data) {
    const token = localStorage.getItem('githubToken');
    if (!token) {
        throw new Error('GitHub token δεν βρέθηκε. Παρακαλώ ορίστε το token στις ρυθμίσεις.');
    }
    
    // Αλλάξτε αυτή τη γραμμή:
    // const content = btoa(JSON.stringify(data, null, 2));
    // Με αυτή:
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    
    try {
        // Get current file SHA (if exists)
        let sha = null;
        try {
            const getResponse = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha;
            }
        } catch (e) {
            // File doesn't exist, that's ok
        }
        
        // Create or update file
        const updateData = {
            message: `Update contact information - ${new Date().toISOString()}`,
            content: content,
            branch: GITHUB_CONFIG.branch
        };
        
        if (sha) {
            updateData.sha = sha;
        }
        
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API Error: ${errorData.message}`);
        }
        
        return await response.json();
        
    } catch (error) {
        throw new Error(`Αποτυχία αποθήκευσης στο GitHub: ${error.message}`);
    }
}

// Set GitHub token
function setGitHubToken() {
    const token = prompt('Εισάγετε το GitHub Personal Access Token σας:');
    if (token) {
        localStorage.setItem('githubToken', token);
        showNotification('GitHub token αποθηκεύτηκε επιτυχώς!', 'success');
    }
}

// Load GitHub token
function loadGitHubToken() {
    const token = localStorage.getItem('githubToken');
    if (token) {
        showNotification('GitHub token φορτώθηκε επιτυχώς!', 'success');
        return token;
    } else {
        showNotification('GitHub token δεν βρέθηκε. Παρακαλώ ορίστε το token.', 'error');
        return null;
    }
}

// Close modal
function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save all changes to JSON file
function saveChanges() {
    const dataStr = JSON.stringify(menuData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'menu-data.json';
    link.click();
    
    showNotification('Τα δεδομένα του μενού κατέβηκαν! Αντικαταστήστε το υπάρχον menu-data.json αρχείο.', 'success');
}

// Change password
function changePassword() {
    const newPassword = document.getElementById('new-password').value;
    if (newPassword.length < 6) {
        showNotification('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες!', 'error');
        return;
    }
    
    // In a real application, you would save this to a secure backend
    showNotification('Ο κωδικός άλλαξε επιτυχώς! (Σημείωση: Αυτό είναι demo - σε πραγματική εφαρμογή θα αποθηκευόταν με ασφάλεια)', 'success');
    document.getElementById('new-password').value = '';
}

// Export all data
function exportAllData() {
    const allData = {
        menu: menuData,
        contact: contactData,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'sushi-noodles-backup.json';
    link.click();
    
    showNotification('Όλα τα δεδομένα εξήχθησαν επιτυχώς!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Enter key login
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
});
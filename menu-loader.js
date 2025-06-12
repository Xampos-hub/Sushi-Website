let menuData = {};
let currentLanguage = 'en';

// Load menu data from JSON
async function loadMenuData() {
    try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`menu-data.json?t=${timestamp}`);
        menuData = await response.json();
        renderMenuItems();
    } catch (error) {
        console.error('Error loading menu data:', error);
        // Fallback to existing hardcoded menu if JSON fails
    }
}

// Auto-refresh menu data every 30 seconds
setInterval(loadMenuData, 30000);

// Render menu items
function renderMenuItems() {
    const menuContainer = document.querySelector('.menu-grid');
    if (!menuContainer) return;
    
    // Clear existing items (except category buttons)
    const existingItems = menuContainer.querySelectorAll('.menu-item');
    existingItems.forEach(item => item.remove());
    
    // Add all categories
    Object.keys(menuData).forEach(category => {
        menuData[category].forEach(item => {
            const menuItem = createMenuItem(item, category);
            menuContainer.appendChild(menuItem);
        });
    });
    
    // Re-initialize menu filtering after adding new items
    if (typeof reinitializeMenuFiltering === 'function') {
        reinitializeMenuFiltering();
    }
}

// Create menu item element
function createMenuItem(item, category) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('data-category', category);
    
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <i class="${item.icon}"></i>
        </div>
        <h3 data-en="${item.name.en}" data-gr="${item.name.gr}">${item.name[currentLanguage]}</h3>
        <p data-en="${item.description.en}" data-gr="${item.description.gr}">${item.description[currentLanguage]}</p>
        <span class="price">${item.price}</span>
    `;
    return menuItem;
}

// Update language for dynamically loaded content
function updateMenuLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('.menu-item [data-en][data-gr]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
}

// Load menu data when page loads
document.addEventListener('DOMContentLoaded', loadMenuData);
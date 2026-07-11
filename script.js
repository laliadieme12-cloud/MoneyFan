// Shopping Cart
let cart = [];

// Add to cart functionality
document.querySelectorAll('.btn-add-cart').forEach((button, index) => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const product = {
            id: index,
            name: productCard.querySelector('h3').textContent,
            price: productCard.querySelector('.price').textContent,
            quantity: 1
        };
        
        addToCart(product);
        showNotification('Produit ajouté au panier!');
    });
});

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }
    updateCartUI();
}

function updateCartUI() {
    console.log('Panier actuel:', cart);
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formType = this.classList.contains('newsletter-form') ? 'Newsletter' : 
                        this.classList.contains('contact-form') ? 'Contact' : 'Unknown';
        
        console.log(`${formType} form submitted:`, new FormData(this));
        showNotification(`Merci! Votre ${formType.toLowerCase()} a été envoyé avec succès.`);
        this.reset();
    });
});

// Authentication buttons
document.querySelector('.btn-login').addEventListener('click', function() {
    showModal('login');
});

document.querySelector('.btn-signup').addEventListener('click', function() {
    showModal('signup');
});

function showModal(type) {
    alert(`Redirection vers la page ${type === 'login' ? 'de connexion' : "d'inscription"}`);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize
console.log('MoneyFan website loaded successfully!');

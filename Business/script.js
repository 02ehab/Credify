// ====== CREDIFY LANDING PAGE FUNCTIONALITY ======

// DOM Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const hashNavLinks = Array.from(navLinks).filter(link => {
  const href = link.getAttribute('href') || '';
  return href.startsWith('#');
});

// ====== NAVIGATION FUNCTIONALITY ======

// Navbar scroll effect
window.addEventListener('scroll', function() {
  if (window.scrollY > 100) {
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// Mobile menu toggle
if (navToggle) {
  navToggle.addEventListener('click', function() {
    if (!navMenu) return;
    navMenu.classList.toggle('active');
    const icon = this.querySelector('.material-symbols-rounded');
    if (icon) {
      icon.textContent = navMenu.classList.contains('active') ? 'close' : 'menu';
    }
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  if (!navMenu || !navToggle) return;
  if (!navbar.contains(e.target)) {
    navMenu.classList.remove('active');
    const icon = navToggle.querySelector('.material-symbols-rounded');
    if (icon) icon.textContent = 'menu';
  }
});

// ====== SMOOTH SCROLLING ======

// Smooth scroll only for hash navigation links
hashNavLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;
    e.preventDefault();
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('.material-symbols-rounded');
        if (icon) icon.textContent = 'menu';
      }
    }
  });
});

// ====== ACTIVE NAVIGATION HIGHLIGHTING ======

// Update active navigation link based on scroll position
window.addEventListener('scroll', function() {
  const scrollPosition = window.scrollY + 100;
  
  // Get all sections
  const sections = document.querySelectorAll('section[id]');
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Remove active class from all links
      navLinks.forEach(link => link.classList.remove('active'));
      
      // Add active class to current section link
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
});

// ====== ANIMATIONS ON SCROLL ======

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.feature-card, .step-item, .pricing-card, .testimonial-card');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// ====== COUNTER ANIMATION ======

// Animate statistics numbers
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('★') ? '★' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('★') ? '★' : '');
    }
  }, 16);
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const text = stat.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        if (number) {
          animateCounter(stat, number);
        }
      });
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Observe hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroObserver.observe(heroSection);
}

// ====== PRICING CARD HOVER EFFECTS ======

// Enhanced hover effects for pricing cards
document.addEventListener('DOMContentLoaded', function() {
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!this.classList.contains('featured')) {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('featured')) {
        this.style.transform = 'translateY(0) scale(1)';
      }
    });
  });
});

// ====== TESTIMONIAL CAROUSEL (Optional Enhancement) ======

// Auto-rotate testimonials
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
  testimonialCards.forEach((card, i) => {
    card.style.opacity = i === index ? '1' : '0.6';
    card.style.transform = i === index ? 'scale(1)' : 'scale(0.95)';
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(currentTestimonial);
}

// Initialize testimonial display
if (testimonialCards.length > 0) {
  showTestimonial(0);
  
  // Auto-rotate every 5 seconds
  setInterval(nextTestimonial, 5000);
}

// ====== FORM VALIDATION (For Contact Forms) ======

// Contact form validation if exists
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('#contact form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const email = formData.get('email');
      const message = formData.get('message');
      
      // Basic validation
      if (!email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Simulate form submission
      showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
      this.reset();
    });
  }
});

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ====== NOTIFICATION SYSTEM ======

// Show notification messages
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  // Set background color based on type
  const colors = {
    success: '#16a34a',
    error: '#dc2626',
    info: '#2563eb'
  };
  
  notification.style.background = colors[type] || colors.info;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Hide and remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// ====== PERFORMANCE OPTIMIZATION ======

// Lazy load images if needed
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
});

// ====== ACCESSIBILITY ENHANCEMENTS ======

// Keyboard navigation for mobile menu
navToggle.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    this.click();
  }
});

// Focus management for mobile menu
if (navMenu) {
  navMenu.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      navMenu.classList.remove('active');
      if (navToggle) {
        const icon = navToggle.querySelector('.material-symbols-rounded');
        if (icon) icon.textContent = 'menu';
        navToggle.focus();
      }
    }
  });
}

// ====== UTILITY FUNCTIONS ======

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ====== INITIALIZATION ======

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Credify landing page initialized successfully!');
  
  // Add loading animation class to body
  document.body.classList.add('loaded');
  
  // Initialize any additional features here
  initializeParallaxEffects();
});

// ====== PARALLAX EFFECTS ======

// Subtle parallax effect for background shapes
function initializeParallaxEffects() {
  const bgShapes = document.querySelectorAll('.bg-shape');
  
  if (bgShapes.length > 0) {
    window.addEventListener('scroll', throttle(function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      bgShapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        shape.style.transform = `translateY(${rate * speed}px)`;
      });
    }, 16));
  }
}

// ====== EXPORT FOR MODULE SYSTEMS ======

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showNotification,
    isValidEmail,
    animateCounter,
    debounce,
    throttle
  };
}

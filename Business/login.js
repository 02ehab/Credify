// ====== LOGIN PAGE FUNCTIONALITY ======

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loginBtn = document.getElementById('loginBtn');
const toast = document.getElementById('toast');

// ====== PASSWORD TOGGLE FUNCTIONALITY ======
passwordToggle.addEventListener('click', function() {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  
  // Update icon
  const icon = this.querySelector('.material-symbols-rounded');
  icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
  
  // Update tooltip
  this.title = type === 'password' ? 'Show password' : 'Hide password';
});

// ====== FORM VALIDATION ======
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function showFieldError(input, message) {
  const formGroup = input.closest('.form-group');
  let errorElement = formGroup.querySelector('.field-error');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
      color: #dc2626;
      font-size: 12px;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    formGroup.appendChild(errorElement);
  }
  
  errorElement.innerHTML = `
    <span class="material-symbols-rounded" style="font-size: 16px;">error</span>
    ${message}
  `;
  
  input.style.borderColor = '#dc2626';
  input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
}

function clearFieldError(input) {
  const formGroup = input.closest('.form-group');
  const errorElement = formGroup.querySelector('.field-error');
  
  if (errorElement) {
    errorElement.remove();
  }
  
  input.style.borderColor = '#e5e7eb';
  input.style.boxShadow = 'none';
}

// ====== INPUT VALIDATION EVENTS ======
emailInput.addEventListener('blur', function() {
  if (this.value.trim() && !validateEmail(this.value)) {
    showFieldError(this, 'Please enter a valid email address');
  } else {
    clearFieldError(this);
  }
});

emailInput.addEventListener('input', function() {
  if (this.value.trim() && validateEmail(this.value)) {
    clearFieldError(this);
  }
});

passwordInput.addEventListener('blur', function() {
  if (this.value.trim() && !validatePassword(this.value)) {
    showFieldError(this, 'Password must be at least 6 characters');
  } else {
    clearFieldError(this);
  }
});

passwordInput.addEventListener('input', function() {
  if (this.value.trim() && validatePassword(this.value)) {
    clearFieldError(this);
  }
});

// ====== FORM SUBMISSION ======
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Get form data
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const rememberMe = rememberMeCheckbox.checked;
  
  // Validate form
  let isValid = true;
  
  if (!email) {
    showFieldError(emailInput, 'Email is required');
    isValid = false;
  } else if (!validateEmail(email)) {
    showFieldError(emailInput, 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!password) {
    showFieldError(passwordInput, 'Password is required');
    isValid = false;
  } else if (!validatePassword(password)) {
    showFieldError(passwordInput, 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (!isValid) {
    showToast('Please fix the errors above', 'error');
    return;
  }
  
  // Show loading state
  setLoadingState(true);
  
  try {
    // Simulate API call
    await simulateLogin(email, password, rememberMe);
    
    // Success - redirect to dashboard
    showToast('Login successful! Redirecting...', 'success');
    
    // Store user data in localStorage (in a real app, this would be a JWT token)
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('rememberMe', rememberMe);
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    showToast(error.message, 'error');
    setLoadingState(false);
  }
});

// ====== SIMULATE LOGIN API CALL ======
async function simulateLogin(email, password, rememberMe) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate different scenarios
      if (email === 'demo@credify.com' && password === 'demo123') {
        resolve({ success: true, user: { email, name: 'Demo User' } });
      } else if (email === 'admin@credify.com' && password === 'admin123') {
        resolve({ success: true, user: { email, name: 'Admin User' } });
      } else if (email === 'test@credify.com' && password === 'test123') {
        resolve({ success: true, user: { email, name: 'Test User' } });
      } else {
        reject(new Error('Invalid email or password. Try demo@credify.com / demo123'));
      }
    }, 2000); // Simulate network delay
  });
}

// ====== LOADING STATE MANAGEMENT ======
function setLoadingState(loading) {
  const btnText = loginBtn.querySelector('.btn-text');
  const btnLoader = loginBtn.querySelector('.btn-loader');
  
  if (loading) {
    loginBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
  } else {
    loginBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

// ====== TOAST NOTIFICATION SYSTEM ======
function showToast(message, type = 'info') {
  // Remove existing toast classes
  toast.className = 'toast';
  
  // Add type class
  toast.classList.add(type);
  
  // Set message
  toast.textContent = message;
  
  // Show toast
  toast.classList.add('show');
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

// ====== SOCIAL LOGIN HANDLERS ======
document.querySelector('.google-btn').addEventListener('click', function() {
  showToast('Google login functionality will be implemented here', 'info');
});

document.querySelector('.apple-btn').addEventListener('click', function() {
  showToast('Apple login functionality will be implemented here', 'info');
});

// ====== FORGOT PASSWORD HANDLER ======
document.querySelector('.forgot-password').addEventListener('click', function(e) {
  e.preventDefault();
  showToast('Password reset functionality will be implemented here', 'info');
});

// ====== REMEMBER ME FUNCTIONALITY ======
// Check if user was previously logged in
window.addEventListener('load', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userEmail = localStorage.getItem('userEmail');
  const rememberMe = localStorage.getItem('rememberMe');
  
  if (isLoggedIn === 'true' && rememberMe === 'true' && userEmail) {
    emailInput.value = userEmail;
    rememberMeCheckbox.checked = true;
  }
});

// ====== ENTER KEY SUBMISSION ======
[emailInput, passwordInput].forEach(input => {
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      loginForm.dispatchEvent(new Event('submit'));
    }
  });
});

// ====== AUTO-FOCUS FIRST INPUT ======
window.addEventListener('load', function() {
  emailInput.focus();
});

// ====== DEMO CREDENTIALS HELPER ======
// Add demo credentials info (remove in production)
const demoInfo = document.createElement('div');
demoInfo.style.cssText = `
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 1000;
  max-width: 250px;
`;
demoInfo.innerHTML = `
  <strong>Demo Credentials:</strong><br>
  • demo@credify.com / demo123<br>
  • admin@credify.com / admin123<br>
  • test@credify.com / test123
`;
document.body.appendChild(demoInfo);

// ====== EXPORT FUNCTIONS FOR TESTING ======
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmail,
    validatePassword,
    showToast,
    simulateLogin
  };
}

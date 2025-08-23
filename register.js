// ====== REGISTER PAGE FUNCTIONALITY ======

// DOM Elements
const registerForm = document.getElementById('registerForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const dateOfBirthInput = document.getElementById('dateOfBirth');
const ssnInput = document.getElementById('ssn');
const passwordToggle = document.getElementById('passwordToggle');
const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
const agreeTermsCheckbox = document.getElementById('agreeTerms');
const agreeMarketingCheckbox = document.getElementById('agreeMarketing');
const registerBtn = document.getElementById('registerBtn');
const toast = document.getElementById('toast');

// Password strength elements
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

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

confirmPasswordToggle.addEventListener('click', function() {
  const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  confirmPasswordInput.setAttribute('type', type);
  
  // Update icon
  const icon = this.querySelector('.material-symbols-rounded');
  icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
  
  // Update tooltip
  this.title = type === 'password' ? 'Show password' : 'Hide password';
});

// ====== FORM VALIDATION ======
function validateName(name) {
  return name.trim().length >= 2;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateDateOfBirth(date) {
  const today = new Date();
  const birthDate = new Date(date);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18 && age <= 120;
}

function validateSSN(ssn) {
  return /^\d{4}$/.test(ssn);
}

// ====== PASSWORD STRENGTH CHECKER ======
function checkPasswordStrength(password) {
  let score = 0;
  let feedback = [];
  
  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');
  
  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letter');
  
  // Lowercase check
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letter');
  
  // Number check
  if (/\d/.test(password)) score += 1;
  else feedback.push('Include number');
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Include special character');
  
  // Update strength bar and text
  strengthFill.className = 'strength-fill';
  
  if (score <= 2) {
    strengthFill.classList.add('weak');
    strengthText.textContent = 'Weak - ' + feedback.slice(0, 2).join(', ');
  } else if (score <= 3) {
    strengthFill.classList.add('fair');
    strengthText.textContent = 'Fair - ' + feedback.slice(0, 2).join(', ');
  } else if (score <= 4) {
    strengthFill.classList.add('good');
    strengthText.textContent = 'Good - ' + feedback.slice(0, 1).join(', ');
  } else {
    strengthFill.classList.add('strong');
    strengthText.textContent = 'Strong password!';
  }
  
  return score;
}

// ====== FIELD ERROR MANAGEMENT ======
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
firstNameInput.addEventListener('blur', function() {
  if (this.value.trim() && !validateName(this.value)) {
    showFieldError(this, 'First name must be at least 2 characters');
  } else {
    clearFieldError(this);
  }
});

firstNameInput.addEventListener('input', function() {
  if (this.value.trim() && validateName(this.value)) {
    clearFieldError(this);
  }
});

lastNameInput.addEventListener('blur', function() {
  if (this.value.trim() && !validateName(this.value)) {
    showFieldError(this, 'Last name must be at least 2 characters');
  } else {
    clearFieldError(this);
  }
});

lastNameInput.addEventListener('input', function() {
  if (this.value.trim() && validateName(this.value)) {
    clearFieldError(this);
  }
});

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

phoneInput.addEventListener('blur', function() {
  if (this.value.trim() && !validatePhone(this.value)) {
    showFieldError(this, 'Please enter a valid phone number');
  } else {
    clearFieldError(this);
  }
});

phoneInput.addEventListener('input', function() {
  if (this.value.trim() && validatePhone(this.value)) {
    clearFieldError(this);
  }
});

passwordInput.addEventListener('input', function() {
  if (this.value.trim()) {
    checkPasswordStrength(this.value);
    if (validatePassword(this.value)) {
      clearFieldError(this);
    }
  } else {
    strengthFill.className = 'strength-fill';
    strengthText.textContent = 'Password strength';
  }
});

passwordInput.addEventListener('blur', function() {
  if (this.value.trim() && !validatePassword(this.value)) {
    showFieldError(this, 'Password must be at least 8 characters');
  } else {
    clearFieldError(this);
  }
});

confirmPasswordInput.addEventListener('blur', function() {
  if (this.value.trim() && this.value !== passwordInput.value) {
    showFieldError(this, 'Passwords do not match');
  } else {
    clearFieldError(this);
  }
});

confirmPasswordInput.addEventListener('input', function() {
  if (this.value.trim() && this.value === passwordInput.value) {
    clearFieldError(this);
  }
});

dateOfBirthInput.addEventListener('blur', function() {
  if (this.value && !validateDateOfBirth(this.value)) {
    showFieldError(this, 'You must be at least 18 years old');
  } else {
    clearFieldError(this);
  }
});

ssnInput.addEventListener('blur', function() {
  if (this.value.trim() && !validateSSN(this.value)) {
    showFieldError(this, 'Please enter the last 4 digits of your SSN');
  } else {
    clearFieldError(this);
  }
});

ssnInput.addEventListener('input', function() {
  // Only allow numbers
  this.value = this.value.replace(/\D/g, '');
  
  if (this.value.trim() && validateSSN(this.value)) {
    clearFieldError(this);
  }
});

// ====== FORM SUBMISSION ======
registerForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Get form data
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();
  const dateOfBirth = dateOfBirthInput.value;
  const ssn = ssnInput.value.trim();
  const agreeTerms = agreeTermsCheckbox.checked;
  const agreeMarketing = agreeMarketingCheckbox.checked;
  
  // Validate form
  let isValid = true;
  
  if (!firstName) {
    showFieldError(firstNameInput, 'First name is required');
    isValid = false;
  } else if (!validateName(firstName)) {
    showFieldError(firstNameInput, 'First name must be at least 2 characters');
    isValid = false;
  }
  
  if (!lastName) {
    showFieldError(lastNameInput, 'Last name is required');
    isValid = false;
  } else if (!validateName(lastName)) {
    showFieldError(lastNameInput, 'Last name must be at least 2 characters');
    isValid = false;
  }
  
  if (!email) {
    showFieldError(emailInput, 'Email is required');
    isValid = false;
  } else if (!validateEmail(email)) {
    showFieldError(emailInput, 'Please enter a valid email address');
    isValid = false;
  }
  
  if (!phone) {
    showFieldError(phoneInput, 'Phone number is required');
    isValid = false;
  } else if (!validatePhone(phone)) {
    showFieldError(phoneInput, 'Please enter a valid phone number');
    isValid = false;
  }
  
  if (!password) {
    showFieldError(passwordInput, 'Password is required');
    isValid = false;
  } else if (!validatePassword(password)) {
    showFieldError(passwordInput, 'Password must be at least 8 characters');
    isValid = false;
  }
  
  if (!confirmPassword) {
    showFieldError(confirmPasswordInput, 'Please confirm your password');
    isValid = false;
  } else if (confirmPassword !== password) {
    showFieldError(confirmPasswordInput, 'Passwords do not match');
    isValid = false;
  }
  
  if (!dateOfBirth) {
    showFieldError(dateOfBirthInput, 'Date of birth is required');
    isValid = false;
  } else if (!validateDateOfBirth(dateOfBirth)) {
    showFieldError(dateOfBirthInput, 'You must be at least 18 years old');
    isValid = false;
  }
  
  if (!ssn) {
    showFieldError(ssnInput, 'SSN is required');
    isValid = false;
  } else if (!validateSSN(ssn)) {
    showFieldError(ssnInput, 'Please enter the last 4 digits of your SSN');
    isValid = false;
  }
  
  if (!agreeTerms) {
    showToast('You must agree to the Terms of Service and Privacy Policy', 'error');
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
    await simulateRegistration({
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      ssn,
      agreeMarketing
    });
    
    // Success - redirect to login
    showToast('Account created successfully! Redirecting to login...', 'success');
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    
  } catch (error) {
    showToast(error.message, 'error');
    setLoadingState(false);
  }
});

// ====== SIMULATE REGISTRATION API CALL ======
async function simulateRegistration(userData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate different scenarios
      if (userData.email === 'existing@example.com') {
        reject(new Error('An account with this email already exists'));
      } else if (userData.email === 'error@example.com') {
        reject(new Error('Registration failed. Please try again.'));
      } else {
        resolve({ 
          success: true, 
          user: { 
            id: Math.random().toString(36).substr(2, 9),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
          } 
        });
      }
    }, 2000); // Simulate network delay
  });
}

// ====== LOADING STATE MANAGEMENT ======
function setLoadingState(loading) {
  const btnText = registerBtn.querySelector('.btn-text');
  const btnLoader = registerBtn.querySelector('.btn-loader');
  
  if (loading) {
    registerBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
  } else {
    registerBtn.disabled = false;
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

// ====== SOCIAL REGISTER HANDLERS ======
document.querySelector('.google-btn').addEventListener('click', function() {
  showToast('Google registration functionality will be implemented here', 'info');
});

document.querySelector('.apple-btn').addEventListener('click', function() {
  showToast('Apple registration functionality will be implemented here', 'info');
});

// ====== TERMS LINKS HANDLERS ======
document.querySelectorAll('.terms-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    showToast('Terms and Privacy Policy will be displayed here', 'info');
  });
});

// ====== ENTER KEY SUBMISSION ======
[firstNameInput, lastNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput, dateOfBirthInput, ssnInput].forEach(input => {
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      registerForm.dispatchEvent(new Event('submit'));
    }
  });
});

// ====== AUTO-FOCUS FIRST INPUT ======
window.addEventListener('load', function() {
  firstNameInput.focus();
  
  // Set minimum date for date of birth (18 years ago)
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  dateOfBirthInput.max = minDate.toISOString().split('T')[0];
});

// ====== EXPORT FUNCTIONS FOR TESTING ======
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateName,
    validateEmail,
    validatePhone,
    validatePassword,
    validateDateOfBirth,
    validateSSN,
    checkPasswordStrength,
    showToast,
    simulateRegistration
  };
}

// ====== CONSENTS PAGE FUNCTIONALITY ======

// DOM Elements
const newConsentBtn = document.getElementById('newConsentBtn');
const exportConsentsBtn = document.getElementById('exportConsentsBtn');
const newConsentForm = document.getElementById('newConsentForm');
const consentForm = document.getElementById('consentForm');
const cancelConsentBtn = document.getElementById('cancelConsentBtn');
const filterTabs = document.querySelectorAll('.filter-tab');
const consentItems = document.querySelectorAll('.consent-item');

// Consent data (in a real app, this would come from an API)
let consents = [
  {
    id: 1,
    status: 'active',
    title: 'Credit Report Access - ABC Bank',
    description: 'Consent to allow ABC Bank to access your credit report for loan application purposes.',
    organization: 'ABC Bank',
    purpose: 'Loan Application',
    dataShared: 'Credit Report, Personal Info',
    duration: '1 Year',
    grantedDate: 'Jan 15, 2024',
    expiryDate: 'Dec 31, 2025',
    revokedDate: null
  },
  {
    id: 2,
    status: 'expiring',
    title: 'Credit Monitoring - XYZ Credit Union',
    description: 'Consent for ongoing credit monitoring and alerts from XYZ Credit Union.',
    organization: 'XYZ Credit Union',
    purpose: 'Credit Monitoring',
    dataShared: 'Credit Alerts, Score Updates',
    duration: '1 Year',
    grantedDate: 'Jan 15, 2024',
    expiryDate: 'Jan 15, 2025',
    revokedDate: null
  },
  {
    id: 3,
    status: 'revoked',
    title: 'Marketing Communications - DEF Bank',
    description: 'Consent for marketing emails and promotional offers from DEF Bank.',
    organization: 'DEF Bank',
    purpose: 'Marketing',
    dataShared: 'Email, Preferences',
    duration: 'Until Revoked',
    grantedDate: 'Mar 10, 2024',
    expiryDate: null,
    revokedDate: 'Nov 20, 2024'
  },
  {
    id: 4,
    status: 'pending',
    title: 'Data Processing - GHI Insurance',
    description: 'Consent for data processing and analysis for insurance quote purposes.',
    organization: 'GHI Insurance',
    purpose: 'Insurance Quote',
    dataShared: 'Risk Assessment Data',
    duration: '6 Months',
    grantedDate: 'Dec 20, 2024',
    expiryDate: null,
    revokedDate: null
  }
];

let currentFilter = 'all';
let displayedConsents = [...consents];

// Initialize consents page
function initializeConsents() {
  console.log('Consents page initialized');
  
  // Set up event listeners
  setupEventListeners();
  
  // Set up filter functionality
  setupFilters();
  
  // Update consent counts
  updateConsentCounts();
}

// Set up event listeners
function setupEventListeners() {
  // New consent button
  if (newConsentBtn) {
    newConsentBtn.addEventListener('click', showNewConsentForm);
  }
  
  // Export consents button
  if (exportConsentsBtn) {
    exportConsentsBtn.addEventListener('click', exportConsents);
  }
  
  // Cancel consent button
  if (cancelConsentBtn) {
    cancelConsentBtn.addEventListener('click', hideNewConsentForm);
  }
  
  // Consent form submission
  if (consentForm) {
    consentForm.addEventListener('submit', handleConsentSubmission);
  }
  
  // Individual consent actions
  setupConsentActions();
}

// Set up consent action buttons
function setupConsentActions() {
  consentItems.forEach(item => {
    const viewDetailsBtn = item.querySelector('#viewDetailsBtn');
    const revokeConsentBtn = item.querySelector('#revokeConsentBtn');
    const renewConsentBtn = item.querySelector('#renewConsentBtn');
    const restoreConsentBtn = item.querySelector('#restoreConsentBtn');
    const approveConsentBtn = item.querySelector('#approveConsentBtn');
    
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener('click', () => viewConsentDetails(item));
    }
    
    if (revokeConsentBtn) {
      revokeConsentBtn.addEventListener('click', () => revokeConsent(item));
    }
    
    if (renewConsentBtn) {
      renewConsentBtn.addEventListener('click', () => renewConsent(item));
    }
    
    if (restoreConsentBtn) {
      restoreConsentBtn.addEventListener('click', () => restoreConsent(item));
    }
    
    if (approveConsentBtn) {
      approveConsentBtn.addEventListener('click', () => approveConsent(item));
    }
  });
}

// Set up filter functionality
function setupFilters() {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      applyFilter(filter);
      
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// Apply filter to consents
function applyFilter(filter) {
  currentFilter = filter;
  
  if (filter === 'all') {
    displayedConsents = [...consents];
  } else {
    displayedConsents = consents.filter(c => c.status === filter);
  }
  
  renderConsents();
  updateConsentCounts();
}

// Render consents based on current filter
function renderConsents() {
  const consentsList = document.querySelector('.consents-list');
  if (!consentsList) return;
  
  consentsList.innerHTML = '';
  
  displayedConsents.forEach(consent => {
    const consentElement = createConsentElement(consent);
    consentsList.appendChild(consentElement);
  });
  
  // Re-setup actions for new elements
  setupConsentActions();
}

// Create consent element
function createConsentElement(consent) {
  const div = document.createElement('div');
  div.className = `consent-item ${consent.status}`;
  div.dataset.status = consent.status;
  
  const statusText = consent.status === 'active' ? 'Active' : 
                    consent.status === 'expiring' ? 'Expiring Soon' :
                    consent.status === 'revoked' ? 'Revoked' : 'Pending Review';
  
  const dateText = consent.status === 'active' ? `Expires: ${consent.expiryDate}` :
                   consent.status === 'expiring' ? `Expires: ${consent.expiryDate}` :
                   consent.status === 'revoked' ? `Revoked: ${consent.revokedDate}` :
                   `Submitted: ${consent.grantedDate}`;
  
  const actionButtons = consent.status === 'active' ? 
    `<button class="btn-secondary" id="viewDetailsBtn">View Details</button>
     <button class="btn-primary" id="revokeConsentBtn">Revoke</button>` :
    consent.status === 'expiring' ?
    `<button class="btn-secondary" id="viewDetailsBtn">View Details</button>
     <button class="btn-primary" id="renewConsentBtn">Renew</button>` :
    consent.status === 'revoked' ?
    `<button class="btn-secondary" id="viewDetailsBtn">View Details</button>
     <button class="btn-primary" id="restoreConsentBtn">Restore</button>` :
    `<button class="btn-secondary" id="viewDetailsBtn">View Details</button>
     <button class="btn-primary" id="approveConsentBtn">Approve</button>`;
  
  div.innerHTML = `
    <div class="consent-header">
      <div class="consent-status ${consent.status}">
        <span class="material-symbols-rounded">${getConsentStatusIcon(consent.status)}</span>
        ${statusText}
      </div>
      <div class="consent-date">${dateText}</div>
    </div>
    <div class="consent-content">
      <h3>${consent.title}</h3>
      <p>${consent.description}</p>
      <div class="consent-details">
        <div class="detail-item">
          <label>Purpose:</label>
          <span>${consent.purpose}</span>
        </div>
        <div class="detail-item">
          <label>Data Shared:</label>
          <span>${consent.dataShared}</span>
        </div>
        <div class="detail-item">
          <label>Duration:</label>
          <span>${consent.duration}</span>
        </div>
        <div class="detail-item">
          <label>${consent.status === 'pending' ? 'Status:' : 'Granted:'}</label>
          <span>${consent.status === 'pending' ? 'Under Review' : consent.grantedDate}</span>
        </div>
      </div>
    </div>
    <div class="consent-actions">
      ${actionButtons}
    </div>
  `;
  
  return div;
}

// Get appropriate icon for consent status
function getConsentStatusIcon(status) {
  const icons = {
    active: 'check_circle',
    expiring: 'schedule',
    revoked: 'cancel',
    pending: 'pending'
  };
  
  return icons[status] || 'assignment_turned_in';
}

// Show new consent form
function showNewConsentForm() {
  if (newConsentForm) {
    newConsentForm.style.display = 'block';
    newConsentForm.scrollIntoView({ behavior: 'smooth' });
  }
}

// Hide new consent form
function hideNewConsentForm() {
  if (newConsentForm) {
    newConsentForm.style.display = 'none';
    consentForm.reset();
  }
}

// Handle consent form submission
function handleConsentSubmission(event) {
  event.preventDefault();
  
  const formData = new FormData(consentForm);
  const consentData = {
    organizationName: formData.get('organizationName'),
    consentPurpose: formData.get('consentPurpose'),
    dataShared: formData.get('dataShared'),
    consentDuration: formData.get('consentDuration'),
    consentDescription: formData.get('consentDescription'),
    agreeTerms: formData.get('agreeTerms')
  };
  
  // Validate form data
  if (!validateConsentForm(consentData)) {
    return;
  }
  
  // Create new consent
  const newConsent = {
    id: consents.length + 1,
    status: 'pending',
    title: `${consentData.consentPurpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${consentData.organizationName}`,
    description: consentData.consentDescription || `Consent for ${consentData.consentPurpose.replace(/_/g, ' ')} from ${consentData.organizationName}.`,
    organization: consentData.organizationName,
    purpose: consentData.consentPurpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    dataShared: consentData.dataShared,
    duration: consentData.consentDuration.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    grantedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    expiryDate: null,
    revokedDate: null
  };
  
  // Add to consents array
  consents.unshift(newConsent);
  
  // Update display
  if (currentFilter === 'all' || currentFilter === 'pending') {
    displayedConsents.unshift(newConsent);
    renderConsents();
  }
  
  // Update counts
  updateConsentCounts();
  
  // Hide form and show success message
  hideNewConsentForm();
  showNotification('Success', 'Consent request submitted successfully!', 'success');
}

// Validate consent form
function validateConsentForm(data) {
  if (!data.organizationName.trim()) {
    showNotification('Error', 'Please enter organization name', 'error');
    return false;
  }
  
  if (!data.consentPurpose) {
    showNotification('Error', 'Please select a consent purpose', 'error');
    return false;
  }
  
  if (!data.dataShared.trim()) {
    showNotification('Error', 'Please describe what data will be shared', 'error');
    return false;
  }
  
  if (!data.consentDuration) {
    showNotification('Error', 'Please select consent duration', 'error');
    return false;
  }
  
  if (!data.agreeTerms) {
    showNotification('Error', 'Please agree to the terms and conditions', 'error');
    return false;
  }
  
  return true;
}

// View consent details
function viewConsentDetails(consentElement) {
  const consentId = getConsentId(consentElement);
  const consent = consents.find(c => c.id === consentId);
  
  if (consent) {
    showNotification('Info', `Viewing details for consent: ${consent.title}`, 'info');
    // In a real app, this would open a modal or navigate to consent details page
  }
}

// Revoke consent
function revokeConsent(consentElement) {
  const consentId = getConsentId(consentElement);
  const consent = consents.find(c => c.id === consentId);
  
  if (consent) {
    if (confirm(`Are you sure you want to revoke the consent: ${consent.title}?`)) {
      // Update consent status to revoked
      consent.status = 'revoked';
      consent.revokedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      // Update display
      renderConsents();
      updateConsentCounts();
      
      showNotification('Success', 'Consent revoked successfully!', 'success');
    }
  }
}

// Renew consent
function renewConsent(consentElement) {
  const consentId = getConsentId(consentElement);
  const consent = consents.find(c => c.id === consentId);
  
  if (consent) {
    showNotification('Info', `Renewing consent: ${consent.title}`, 'info');
    // In a real app, this would open a renewal form
  }
}

// Restore consent
function restoreConsent(consentElement) {
  const consentId = getConsentId(consentElement);
  const consent = consents.find(c => c.id === consentId);
  
  if (consent) {
    if (confirm(`Are you sure you want to restore the consent: ${consent.title}?`)) {
      // Update consent status to active
      consent.status = 'active';
      consent.revokedDate = null;
      consent.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      // Update display
      renderConsents();
      updateConsentCounts();
      
      showNotification('Success', 'Consent restored successfully!', 'success');
    }
  }
}

// Approve consent
function approveConsent(consentElement) {
  const consentId = getConsentId(consentElement);
  const consent = consents.find(c => c.id === consentId);
  
  if (consent) {
    if (confirm(`Are you sure you want to approve the consent: ${consent.title}?`)) {
      // Update consent status to active
      consent.status = 'active';
      consent.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      // Update display
      renderConsents();
      updateConsentCounts();
      
      showNotification('Success', 'Consent approved successfully!', 'success');
    }
  }
}

// Export consents
function exportConsents() {
  showNotification('Info', 'Preparing consents export...', 'info');
  
  // Simulate export process
  setTimeout(() => {
    showNotification('Success', 'Consents exported successfully!', 'success');
  }, 1500);
}

// Get consent ID from element
function getConsentId(element) {
  const index = Array.from(element.parentNode.children).indexOf(element);
  return displayedConsents[index]?.id;
}

// Update consent counts
function updateConsentCounts() {
  const activeCount = consents.filter(c => c.status === 'active').length;
  const expiringCount = consents.filter(c => c.status === 'expiring').length;
  const revokedCount = consents.filter(c => c.status === 'revoked').length;
  const pendingCount = consents.filter(c => c.status === 'pending').length;
  
  // Update summary cards
  updateElement('activeConsents', activeCount);
  updateElement('expiringConsents', expiringCount);
  updateElement('revokedConsents', revokedCount);
  updateElement('pendingConsents', pendingCount);
}

// Helper function to update DOM elements
function updateElement(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

// Show notification function
function showNotification(title, message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `toast-notification toast-${type}`;
  notification.innerHTML = `
    <div class="toast-header">
      <h4>${title}</h4>
      <button class="toast-close">&times;</button>
    </div>
    <p>${message}</p>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 16px;
    min-width: 300px;
    z-index: 10000;
    border-left: 4px solid ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb'};
    animation: slideInRight 0.3s ease;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
  }
}

// Add notification styles to the page
function addNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .toast-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
      float: right;
      margin-top: -8px;
    }
    
    .toast-close:hover {
      color: #374151;
    }
    
    .toast-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .toast-header h4 {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
    }
    
    .toast-notification p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addNotificationStyles();
  initializeConsents();
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeConsents,
    showNewConsentForm,
    hideNewConsentForm,
    handleConsentSubmission,
    applyFilter,
    showNotification
  };
}

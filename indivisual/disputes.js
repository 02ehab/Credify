// ====== DISPUTES PAGE FUNCTIONALITY ======

// DOM Elements
const newDisputeBtn = document.getElementById('newDisputeBtn');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const newDisputeForm = document.getElementById('newDisputeForm');
const disputeForm = document.getElementById('disputeForm');
const cancelDisputeBtn = document.getElementById('cancelDisputeBtn');
const filterTabs = document.querySelectorAll('.filter-tab');
const disputeItems = document.querySelectorAll('.dispute-item');

// Dispute data (in a real app, this would come from an API)
let disputes = [
  {
    id: 1,
    status: 'pending',
    title: 'Late Payment Dispute - Account #12345',
    description: 'Disputing a late payment reported by ABC Bank for January 2024. Payment was made on time but not properly recorded.',
    creditor: 'ABC Bank',
    accountNumber: '****1234',
    disputeReason: 'Payment Made on Time',
    filedDate: 'Dec 15, 2024',
    resolvedDate: null,
    rejectionReason: null
  },
  {
    id: 2,
    status: 'resolved',
    title: 'Incorrect Balance Dispute - Account #67890',
    description: 'Successfully disputed incorrect balance reporting. Creditor has updated the information and removed the negative mark.',
    creditor: 'XYZ Credit Union',
    accountNumber: '****5678',
    disputeReason: 'Incorrect Balance',
    filedDate: 'Nov 20, 2024',
    resolvedDate: 'Dec 10, 2024',
    rejectionReason: null
  },
  {
    id: 3,
    status: 'rejected',
    title: 'Account Ownership Dispute - Account #11111',
    description: 'Dispute was rejected due to insufficient documentation. Additional evidence required to support claim.',
    creditor: 'DEF Bank',
    accountNumber: '****1111',
    disputeReason: 'Account Not Mine',
    filedDate: 'Nov 15, 2024',
    resolvedDate: 'Dec 5, 2024',
    rejectionReason: 'Insufficient Documentation'
  }
];

let currentFilter = 'all';
let displayedDisputes = [...disputes];

// Initialize disputes page
function initializeDisputes() {
  console.log('Disputes page initialized');
  
  // Set up event listeners
  setupEventListeners();
  
  // Set up filter functionality
  setupFilters();
  
  // Update dispute counts
  updateDisputeCounts();
}

// Set up event listeners
function setupEventListeners() {
  // New dispute button
  if (newDisputeBtn) {
    newDisputeBtn.addEventListener('click', showNewDisputeForm);
  }
  
  // View history button
  if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener('click', viewDisputeHistory);
  }
  
  // Cancel dispute button
  if (cancelDisputeBtn) {
    cancelDisputeBtn.addEventListener('click', hideNewDisputeForm);
  }
  
  // Dispute form submission
  if (disputeForm) {
    disputeForm.addEventListener('submit', handleDisputeSubmission);
  }
  
  // Individual dispute actions
  setupDisputeActions();
}

// Set up dispute action buttons
function setupDisputeActions() {
  disputeItems.forEach(item => {
    const viewDetailsBtn = item.querySelector('#viewDetailsBtn');
    const updateDisputeBtn = item.querySelector('#updateDisputeBtn');
    const downloadReportBtn = item.querySelector('#downloadReportBtn');
    const resubmitBtn = item.querySelector('#resubmitBtn');
    
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener('click', () => viewDisputeDetails(item));
    }
    
    if (updateDisputeBtn) {
      updateDisputeBtn.addEventListener('click', () => updateDispute(item));
    }
    
    if (downloadReportBtn) {
      downloadReportBtn.addEventListener('click', () => downloadDisputeReport(item));
    }
    
    if (resubmitBtn) {
      resubmitBtn.addEventListener('click', () => resubmitDispute(item));
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

// Apply filter to disputes
function applyFilter(filter) {
  currentFilter = filter;
  
  if (filter === 'all') {
    displayedDisputes = [...disputes];
  } else {
    displayedDisputes = disputes.filter(d => d.status === filter);
  }
  
  renderDisputes();
  updateDisputeCounts();
}

// Render disputes based on current filter
function renderDisputes() {
  const disputesList = document.querySelector('.disputes-list');
  if (!disputesList) return;
  
  disputesList.innerHTML = '';
  
  displayedDisputes.forEach(dispute => {
    const disputeElement = createDisputeElement(dispute);
    disputesList.appendChild(disputeElement);
  });
  
  // Re-setup actions for new elements
  setupDisputeActions();
}

// Create dispute element
function createDisputeElement(dispute) {
  const div = document.createElement('div');
  div.className = `dispute-item ${dispute.status}`;
  div.dataset.status = dispute.status;
  
  const statusText = dispute.status === 'pending' ? 'Pending' : 
                    dispute.status === 'resolved' ? 'Resolved' : 'Rejected';
  
  const dateText = dispute.status === 'pending' ? `Filed: ${dispute.filedDate}` :
                   dispute.status === 'resolved' ? `Resolved: ${dispute.resolvedDate}` :
                   `Rejected: ${dispute.resolvedDate}`;
  
  const actionButtons = dispute.status === 'pending' ? 
    `<button class="btn-secondary" id="viewDetailsBtn">View Details</button>
     <button class="btn-primary" id="updateDisputeBtn">Update</button>` :
    dispute.status === 'resolved' ?
    `<button class="btn-secondary" id="viewDetailsBtn">View Details</button>
     <button class="btn-primary" id="downloadReportBtn">Download Report</button>` :
    `<button class="btn-secondary" id="viewDetailsBtn">View Details</button>
     <button class="btn-primary" id="resubmitBtn">Resubmit</button>`;
  
  div.innerHTML = `
    <div class="dispute-header">
      <div class="dispute-status ${dispute.status}">
        <span class="material-symbols-rounded">${getDisputeStatusIcon(dispute.status)}</span>
        ${statusText}
      </div>
      <div class="dispute-date">${dateText}</div>
    </div>
    <div class="dispute-content">
      <h3>${dispute.title}</h3>
      <p>${dispute.description}</p>
      <div class="dispute-details">
        <div class="detail-item">
          <label>Creditor:</label>
          <span>${dispute.creditor}</span>
        </div>
        <div class="detail-item">
          <label>Account Number:</label>
          <span>${dispute.accountNumber}</span>
        </div>
        <div class="detail-item">
          <label>${dispute.status === 'rejected' ? 'Rejection Reason:' : 'Dispute Reason:'}</label>
          <span>${dispute.status === 'rejected' ? dispute.rejectionReason : dispute.disputeReason}</span>
        </div>
      </div>
    </div>
    <div class="dispute-actions">
      ${actionButtons}
    </div>
  `;
  
  return div;
}

// Get appropriate icon for dispute status
function getDisputeStatusIcon(status) {
  const icons = {
    pending: 'pending',
    resolved: 'check_circle',
    rejected: 'cancel'
  };
  
  return icons[status] || 'gavel';
}

// Show new dispute form
function showNewDisputeForm() {
  if (newDisputeForm) {
    newDisputeForm.style.display = 'block';
    newDisputeForm.scrollIntoView({ behavior: 'smooth' });
  }
}

// Hide new dispute form
function hideNewDisputeForm() {
  if (newDisputeForm) {
    newDisputeForm.style.display = 'none';
    disputeForm.reset();
  }
}

// Handle dispute form submission
function handleDisputeSubmission(event) {
  event.preventDefault();
  
  const formData = new FormData(disputeForm);
  const disputeData = {
    creditorName: formData.get('creditorName'),
    accountNumber: formData.get('accountNumber'),
    disputeReason: formData.get('disputeReason'),
    disputeDescription: formData.get('disputeDescription'),
    supportingDocuments: formData.get('supportingDocuments')
  };
  
  // Validate form data
  if (!validateDisputeForm(disputeData)) {
    return;
  }
  
  // Create new dispute
  const newDispute = {
    id: disputes.length + 1,
    status: 'pending',
    title: `${disputeData.disputeReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Dispute - Account #${disputeData.accountNumber.slice(-4)}`,
    description: disputeData.disputeDescription,
    creditor: disputeData.creditorName,
    accountNumber: `****${disputeData.accountNumber.slice(-4)}`,
    disputeReason: disputeData.disputeReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    filedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    resolvedDate: null,
    rejectionReason: null
  };
  
  // Add to disputes array
  disputes.unshift(newDispute);
  
  // Update display
  if (currentFilter === 'all' || currentFilter === 'pending') {
    displayedDisputes.unshift(newDispute);
    renderDisputes();
  }
  
  // Update counts
  updateDisputeCounts();
  
  // Hide form and show success message
  hideNewDisputeForm();
  showNotification('Success', 'Dispute submitted successfully!', 'success');
}

// Validate dispute form
function validateDisputeForm(data) {
  if (!data.creditorName.trim()) {
    showNotification('Error', 'Please enter creditor name', 'error');
    return false;
  }
  
  if (!data.accountNumber.trim()) {
    showNotification('Error', 'Please enter account number', 'error');
    return false;
  }
  
  if (!data.disputeReason) {
    showNotification('Error', 'Please select a dispute reason', 'error');
    return false;
  }
  
  if (!data.disputeDescription.trim()) {
    showNotification('Error', 'Please provide a description', 'error');
    return false;
  }
  
  return true;
}

// View dispute details
function viewDisputeDetails(disputeElement) {
  const disputeId = getDisputeId(disputeElement);
  const dispute = disputes.find(d => d.id === disputeId);
  
  if (dispute) {
    showNotification('Info', `Viewing details for dispute: ${dispute.title}`, 'info');
    // In a real app, this would open a modal or navigate to a details page
  }
}

// Update dispute
function updateDispute(disputeElement) {
  const disputeId = getDisputeId(disputeElement);
  const dispute = disputes.find(d => d.id === disputeId);
  
  if (dispute) {
    showNotification('Info', `Updating dispute: ${dispute.title}`, 'info');
    // In a real app, this would open an edit form
  }
}

// Download dispute report
function downloadDisputeReport(disputeElement) {
  const disputeId = getDisputeId(disputeElement);
  const dispute = disputes.find(d => d.id === disputeId);
  
  if (dispute) {
    showNotification('Success', `Downloading report for: ${dispute.title}`, 'success');
    // In a real app, this would trigger a file download
  }
}

// Resubmit dispute
function resubmitDispute(disputeElement) {
  const disputeId = getDisputeId(disputeElement);
  const dispute = disputes.find(d => d.id === disputeId);
  
  if (dispute) {
    if (confirm(`Are you sure you want to resubmit the dispute: ${dispute.title}?`)) {
      // Update dispute status to pending
      dispute.status = 'pending';
      dispute.filedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      dispute.resolvedDate = null;
      dispute.rejectionReason = null;
      
      // Update display
      renderDisputes();
      updateDisputeCounts();
      
      showNotification('Success', 'Dispute resubmitted successfully!', 'success');
    }
  }
}

// View dispute history
function viewDisputeHistory() {
  showNotification('Info', 'Viewing dispute history', 'info');
  // In a real app, this would show a detailed history view
}

// Get dispute ID from element
function getDisputeId(element) {
  const index = Array.from(element.parentNode.children).indexOf(element);
  return displayedDisputes[index]?.id;
}

// Update dispute counts
function updateDisputeCounts() {
  const pendingCount = disputes.filter(d => d.status === 'pending').length;
  const resolvedCount = disputes.filter(d => d.status === 'resolved').length;
  const rejectedCount = disputes.filter(d => d.status === 'rejected').length;
  const successRate = resolvedCount > 0 ? Math.round((resolvedCount / (resolvedCount + rejectedCount)) * 100) : 0;
  
  // Update summary cards
  updateElement('pendingCount', pendingCount);
  updateElement('resolvedCount', resolvedCount);
  updateElement('rejectedCount', rejectedCount);
  updateElement('successRate', `${successRate}%`);
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
  initializeDisputes();
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeDisputes,
    showNewDisputeForm,
    hideNewDisputeForm,
    handleDisputeSubmission,
    applyFilter,
    showNotification
  };
}

// ====== CREDIT OVERVIEW PAGE FUNCTIONALITY ======

// DOM Elements
const refreshCreditBtn = document.getElementById('refreshCreditBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');
const addAccountBtn = document.getElementById('addAccountBtn');
const chartPeriods = document.querySelectorAll('.chart-period');

// Credit data (in a real app, this would come from an API)
let creditData = {
  creditScore: 750,
  scoreChange: 15,
  totalCredit: 45000,
  availableCredit: 28500,
  creditUtilization: 36.7,
  paymentHistory: 98,
  accounts: [
    {
      id: 1,
      name: 'ABC Bank Credit Card',
      number: '****1234',
      balance: 2450,
      creditLimit: 8000,
      paymentDue: 'Dec 25, 2024',
      utilization: 30.6,
      status: 'active'
    },
    {
      id: 2,
      name: 'XYZ Credit Union Loan',
      number: '****5678',
      balance: 12800,
      originalAmount: 15000,
      nextPayment: 'Jan 15, 2025',
      interestRate: 6.5,
      status: 'active'
    },
    {
      id: 3,
      name: 'DEF Bank Mortgage',
      number: '****9999',
      balance: 185000,
      originalAmount: 220000,
      nextPayment: 'Jan 1, 2025',
      interestRate: 4.2,
      status: 'active'
    }
  ]
};

// Initialize credit overview page
function initializeCreditOverview() {
  console.log('Credit overview page initialized');
  
  // Set up event listeners
  setupEventListeners();
  
  // Load credit data
  loadCreditData();
  
  // Set up chart functionality
  setupChartControls();
  
  // Update credit score range
  updateCreditScoreRange();
}

// Set up event listeners
function setupEventListeners() {
  // Refresh credit button
  if (refreshCreditBtn) {
    refreshCreditBtn.addEventListener('click', refreshCreditData);
  }
  
  // Download report button
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener('click', downloadCreditReport);
  }
  
  // Add account button
  if (addAccountBtn) {
    addAccountBtn.addEventListener('click', addNewAccount);
  }
  
  // Account action buttons
  setupAccountActions();
}

// Set up account action buttons
function setupAccountActions() {
  const viewDetailsBtns = document.querySelectorAll('.account-actions .btn-secondary');
  const makePaymentBtns = document.querySelectorAll('.account-actions .btn-primary');
  
  viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const accountItem = e.target.closest('.account-item');
      viewAccountDetails(accountItem);
    });
  });
  
  makePaymentBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const accountItem = e.target.closest('.account-item');
      makeAccountPayment(accountItem);
    });
  });
}

// Set up chart controls
function setupChartControls() {
  chartPeriods.forEach(period => {
    period.addEventListener('click', () => {
      const selectedPeriod = period.dataset.period;
      changeChartPeriod(selectedPeriod);
      
      // Update active period
      chartPeriods.forEach(p => p.classList.remove('active'));
      period.classList.add('active');
    });
  });
}

// Load credit data into the DOM
function loadCreditData() {
  // Update credit score
  updateElement('creditScore', creditData.creditScore);
  updateElement('scoreChange', creditData.scoreChange > 0 ? `+${creditData.scoreChange}` : creditData.scoreChange);
  
  // Update summary cards
  updateElement('totalCredit', formatCurrency(creditData.totalCredit));
  updateElement('availableCredit', formatCurrency(creditData.availableCredit));
  updateElement('creditUtilization', `${creditData.creditUtilization}%`);
  updateElement('paymentHistory', `${creditData.paymentHistory}%`);
  
  // Update score change styling
  const scoreChangeElement = document.getElementById('scoreChange');
  if (scoreChangeElement) {
    scoreChangeElement.className = `score-change ${creditData.scoreChange >= 0 ? 'positive' : 'negative'}`;
  }
  
  // Update summary card changes
  updateSummaryCardChanges();
}

// Update summary card changes
function updateSummaryCardChanges() {
  const totalCreditChange = document.querySelector('#totalCredit').nextElementSibling;
  const availableCreditChange = document.querySelector('#availableCredit').nextElementSibling;
  const creditUtilizationChange = document.querySelector('#creditUtilization').nextElementSibling;
  const paymentHistoryChange = document.querySelector('#paymentHistory').nextElementSibling;
  
  if (totalCreditChange) {
    totalCreditChange.textContent = '+$5,000';
    totalCreditChange.className = 'card-change positive';
  }
  
  if (availableCreditChange) {
    availableCreditChange.textContent = '+$3,200';
    availableCreditChange.className = 'card-change positive';
  }
  
  if (creditUtilizationChange) {
    creditUtilizationChange.textContent = '-2.3%';
    creditUtilizationChange.className = 'card-change negative';
  }
  
  if (paymentHistoryChange) {
    paymentHistoryChange.textContent = '+1%';
    paymentHistoryChange.className = 'card-change positive';
  }
}

// Update credit score range
function updateCreditScoreRange() {
  const rangeFill = document.querySelector('.range-fill');
  if (rangeFill) {
    const percentage = ((creditData.creditScore - 300) / (850 - 300)) * 100;
    rangeFill.style.width = `${percentage}%`;
  }
}

// Refresh credit data
function refreshCreditData() {
  // Show loading state
  if (refreshCreditBtn) {
    refreshCreditBtn.textContent = 'Refreshing...';
    refreshCreditBtn.disabled = true;
  }
  
  // Simulate API call
  setTimeout(() => {
    // Update credit score (random change for demo)
    const scoreChange = Math.floor(Math.random() * 21) - 10; // -10 to +10
    creditData.creditScore = Math.max(300, Math.min(850, creditData.creditScore + scoreChange));
    creditData.scoreChange = scoreChange;
    
    // Update other metrics
    creditData.totalCredit += Math.floor(Math.random() * 2000) - 1000;
    creditData.availableCredit += Math.floor(Math.random() * 1500) - 750;
    creditData.creditUtilization = Math.max(0, Math.min(100, creditData.creditUtilization + (Math.random() * 4 - 2)));
    creditData.paymentHistory = Math.max(90, Math.min(100, creditData.paymentHistory + (Math.random() * 2 - 1)));
    
    // Reload data
    loadCreditData();
    updateCreditScoreRange();
    
    // Reset button
    if (refreshCreditBtn) {
      refreshCreditBtn.textContent = 'Refresh Credit';
      refreshCreditBtn.disabled = false;
    }
    
    showNotification('Success', 'Credit data refreshed successfully!', 'success');
  }, 2000);
}

// Download credit report
function downloadCreditReport() {
  showNotification('Info', 'Preparing credit report for download...', 'info');
  
  // Simulate download process
  setTimeout(() => {
    showNotification('Success', 'Credit report downloaded successfully!', 'success');
  }, 1500);
}

// Add new account
function addNewAccount() {
  showNotification('Info', 'Add account functionality will be implemented here', 'info');
  // In a real app, this would open a form to add a new credit account
}

// View account details
function viewAccountDetails(accountItem) {
  const accountName = accountItem.querySelector('h3').textContent;
  showNotification('Info', `Viewing details for: ${accountName}`, 'info');
  // In a real app, this would open a modal or navigate to account details page
}

// Make account payment
function makeAccountPayment(accountItem) {
  const accountName = accountItem.querySelector('h3').textContent;
  showNotification('Info', `Making payment for: ${accountName}`, 'info');
  // In a real app, this would open a payment form
}

// Change chart period
function changeChartPeriod(period) {
  showNotification('Info', `Chart period changed to: ${period}`, 'info');
  // In a real app, this would update the chart data and re-render
}

// Helper function to update DOM elements
function updateElement(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
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
  initializeCreditOverview();
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeCreditOverview,
    refreshCreditData,
    downloadCreditReport,
    addNewAccount,
    showNotification
  };
}

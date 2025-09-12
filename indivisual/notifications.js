// ====== NOTIFICATIONS PAGE FUNCTIONALITY ======

// DOM Elements
const markAllReadBtn = document.getElementById('markAllReadBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterTabs = document.querySelectorAll('.filter-tab');
const notificationItems = document.querySelectorAll('.notification-item');

// Notification data (in a real app, this would come from an API)
let notifications = [
  {
    id: 1,
    type: 'credit',
    title: 'Credit Score Updated',
    message: 'Your credit score has been updated to 750. This is a 15-point increase from last month.',
    time: '2 hours ago',
    category: 'Credit',
    unread: true
  },
  {
    id: 2,
    type: 'disputes',
    title: 'Dispute Status Changed',
    message: 'Your dispute regarding the late payment on account #12345 has been resolved in your favor.',
    time: '1 day ago',
    category: 'Disputes',
    unread: false
  },
  {
    id: 3,
    type: 'system',
    title: 'Security Alert',
    message: 'New login detected from Cairo, Egypt. If this wasn\'t you, please review your account security.',
    time: '3 days ago',
    category: 'System',
    unread: true
  },
  {
    id: 4,
    type: 'credit',
    title: 'Loan Payment Due',
    message: 'Your loan payment of $500 is due in 5 days. Please ensure timely payment to maintain your credit score.',
    time: '5 days ago',
    category: 'Credit',
    unread: false
  },
  {
    id: 5,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur on Sunday, 2:00 AM - 4:00 AM. Some services may be temporarily unavailable.',
    time: '1 week ago',
    category: 'System',
    unread: false
  }
];

let currentFilter = 'all';
let displayedNotifications = [...notifications];

// Initialize notifications page
function initializeNotifications() {
  console.log('Notifications page initialized');
  
  // Set up event listeners
  setupEventListeners();
  
  // Set up filter functionality
  setupFilters();
  
  // Update notification count
  updateNotificationCount();
}

// Set up event listeners
function setupEventListeners() {
  // Mark all as read button
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', markAllAsRead);
  }
  
  // Clear all button
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllNotifications);
  }
  
  // Load more button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreNotifications);
  }
  
  // Individual notification actions
  setupNotificationActions();
}

// Set up notification action buttons
function setupNotificationActions() {
  notificationItems.forEach(item => {
    const markReadBtn = item.querySelector('.mark-read-btn');
    const deleteBtn = item.querySelector('.delete-btn');
    
    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => markAsRead(item));
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => deleteNotification(item));
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

// Apply filter to notifications
function applyFilter(filter) {
  currentFilter = filter;
  
  if (filter === 'all') {
    displayedNotifications = [...notifications];
  } else if (filter === 'unread') {
    displayedNotifications = notifications.filter(n => n.unread);
  } else {
    displayedNotifications = notifications.filter(n => n.type === filter);
  }
  
  renderNotifications();
  updateNotificationCount();
}

// Render notifications based on current filter
function renderNotifications() {
  const notificationsList = document.querySelector('.notifications-list');
  if (!notificationsList) return;
  
  notificationsList.innerHTML = '';
  
  displayedNotifications.forEach(notification => {
    const notificationElement = createNotificationElement(notification);
    notificationsList.appendChild(notificationElement);
  });
  
  // Re-setup actions for new elements
  setupNotificationActions();
}

// Create notification element
function createNotificationElement(notification) {
  const div = document.createElement('div');
  div.className = `notification-item ${notification.unread ? 'unread' : ''}`;
  div.dataset.type = notification.type;
  
  div.innerHTML = `
    <div class="notification-icon ${notification.type === 'disputes' ? 'disputes' : notification.type === 'system' ? 'system' : ''}">
      <span class="material-symbols-rounded">${getNotificationIcon(notification.type)}</span>
    </div>
    <div class="notification-content">
      <h3>${notification.title}</h3>
      <p>${notification.message}</p>
      <div class="notification-meta">
        <span class="notification-time">${notification.time}</span>
        <span class="notification-category">${notification.category}</span>
      </div>
    </div>
    <div class="notification-actions">
      <button class="mark-read-btn" title="Mark as read">
        <span class="material-symbols-rounded">check_circle</span>
      </button>
      <button class="delete-btn" title="Delete">
        <span class="material-symbols-rounded">delete</span>
      </button>
    </div>
  `;
  
  return div;
}

// Get appropriate icon for notification type
function getNotificationIcon(type) {
  const icons = {
    credit: 'credit_score',
    disputes: 'gavel',
    system: 'security',
    default: 'notifications'
  };
  
  return icons[type] || icons.default;
}

// Mark all notifications as read
function markAllAsRead() {
  notifications.forEach(notification => {
    notification.unread = false;
  });
  
  displayedNotifications.forEach(notification => {
    notification.unread = false;
  });
  
  renderNotifications();
  updateNotificationCount();
  
  showNotification('Success', 'All notifications marked as read', 'success');
}

// Mark individual notification as read
function markAsRead(notificationElement) {
  const notificationId = getNotificationId(notificationElement);
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.unread = false;
    notificationElement.classList.remove('unread');
    
    // Update the displayed notifications
    const displayedNotification = displayedNotifications.find(n => n.id === notificationId);
    if (displayedNotification) {
      displayedNotification.unread = false;
    }
    
    updateNotificationCount();
    showNotification('Success', 'Notification marked as read', 'success');
  }
}

// Delete notification
function deleteNotification(notificationElement) {
  const notificationId = getNotificationId(notificationElement);
  
  // Remove from both arrays
  notifications = notifications.filter(n => n.id !== notificationId);
  displayedNotifications = displayedNotifications.filter(n => n.id !== notificationId);
  
  // Remove from DOM
  notificationElement.remove();
  
  updateNotificationCount();
  showNotification('Success', 'Notification deleted', 'success');
}

// Clear all notifications
function clearAllNotifications() {
  if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
    notifications = [];
    displayedNotifications = [];
    renderNotifications();
    updateNotificationCount();
    showNotification('Success', 'All notifications cleared', 'success');
  }
}

// Load more notifications
function loadMoreNotifications() {
  // In a real app, this would fetch more notifications from an API
  showNotification('Info', 'Load more functionality will be implemented here', 'info');
}

// Get notification ID from element
function getNotificationId(element) {
  // Find the notification in the displayedNotifications array
  const index = Array.from(element.parentNode.children).indexOf(element);
  return displayedNotifications[index]?.id;
}

// Update notification count
function updateNotificationCount() {
  const unreadCount = notifications.filter(n => n.unread).length;
  
  // Update page title if there are unread notifications
  if (unreadCount > 0) {
    document.title = `(${unreadCount}) Notifications - Credify`;
  } else {
    document.title = 'Notifications - Credify';
  }
  
  // Update the mark all read button text
  if (markAllReadBtn) {
    markAllReadBtn.textContent = unreadCount > 0 ? `Mark All as Read (${unreadCount})` : 'Mark All as Read';
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
  initializeNotifications();
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeNotifications,
    markAllAsRead,
    clearAllNotifications,
    applyFilter,
    showNotification
  };
}

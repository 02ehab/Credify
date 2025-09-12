// ====== PROFILE PAGE FUNCTIONALITY ======

// DOM Elements
const profileImage = document.getElementById('profileImage');
const avatarEditBtn = document.getElementById('avatarEditBtn');
const editProfileBtn = document.getElementById('editProfileBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');

// Profile data (in a real app, this would come from an API)
const profileData = {
  userName: 'Ahmed Ali',
  userEmail: 'ahmed@example.com',
  userRole: 'Individual',
  fullName: 'Ahmed Ali Mohamed',
  dateOfBirth: '15 March 1990',
  phoneNumber: '+20 123 456 789',
  nationalId: '12345678901234',
  address: 'Cairo, Egypt',
  occupation: 'Software Engineer',
  memberSince: 'January 2023',
  accountStatus: 'Active',
  lastLogin: 'Today, 2:30 PM',
  twoFactorStatus: 'Inactive',
  creditScore: 750,
  activeLoans: 2,
  totalCredit: '$15,000',
  paymentHistory: '98%'
};

// Initialize profile page
function initializeProfile() {
  console.log('Profile page initialized');
  
  // Set up event listeners
  setupEventListeners();
  
  // Load profile data
  loadProfileData();
  
  // Set up avatar functionality
  setupAvatarFunctionality();
}

// Set up event listeners
function setupEventListeners() {
  // Edit profile button
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', handleEditProfile);
  }
  
  // Change password button
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', handleChangePassword);
  }
  
  // Avatar edit button
  if (avatarEditBtn) {
    avatarEditBtn.addEventListener('click', handleAvatarEdit);
  }
}

// Load profile data into the DOM
function loadProfileData() {
  // Update profile header
  updateElement('userName', profileData.userName);
  updateElement('userEmail', profileData.userEmail);
  updateElement('userRole', profileData.userRole);
  
  // Update personal information
  updateElement('fullName', profileData.fullName);
  updateElement('dateOfBirth', profileData.dateOfBirth);
  updateElement('phoneNumber', profileData.phoneNumber);
  updateElement('nationalId', profileData.nationalId);
  updateElement('address', profileData.address);
  updateElement('occupation', profileData.occupation);
  
  // Update account information
  updateElement('memberSince', profileData.memberSince);
  updateElement('accountStatus', profileData.accountStatus);
  updateElement('lastLogin', profileData.lastLogin);
  updateElement('twoFactorStatus', profileData.twoFactorStatus);
  
  // Update credit summary
  updateElement('creditScore', profileData.creditScore);
  updateElement('activeLoans', profileData.activeLoans);
  updateElement('totalCredit', profileData.totalCredit);
  updateElement('paymentHistory', profileData.paymentHistory);
}

// Helper function to update DOM elements
function updateElement(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

// Set up avatar functionality
function setupAvatarFunctionality() {
  // Check if profile image exists, if not use a default avatar
  if (profileImage) {
    profileImage.addEventListener('error', function() {
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB4PSIzMCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOUI5Q0FGIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+';
    });
  }
}

// Handle edit profile button click
function handleEditProfile() {
  console.log('Edit profile clicked');
  
  // Show a modal or navigate to edit profile page
  showNotification('Edit Profile', 'Edit profile functionality will be implemented here.', 'info');
  
  // In a real app, you might:
  // - Show a modal with form fields
  // - Navigate to an edit profile page
  // - Open a form overlay
}

// Handle change password button click
function handleChangePassword() {
  console.log('Change password clicked');
  
  // Show a modal or navigate to change password page
  showNotification('Change Password', 'Change password functionality will be implemented here.', 'info');
  
  // In a real app, you might:
  // - Show a modal with password fields
  // - Navigate to a change password page
  // - Open a form overlay
}

// Handle avatar edit button click
function handleAvatarEdit() {
  console.log('Avatar edit clicked');
  
  // Create a file input element
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  
  // Add event listener for file selection
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      handleAvatarUpload(file);
    }
  });
  
  // Trigger file selection
  document.body.appendChild(fileInput);
  fileInput.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(fileInput);
  }, 1000);
}

// Handle avatar upload
function handleAvatarUpload(file) {
  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    showNotification('Error', 'Please select a valid image file.', 'error');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    showNotification('Error', 'Image file size should be less than 5MB.', 'error');
    return;
  }
  
  // Create a preview
  const reader = new FileReader();
  reader.onload = function(e) {
    if (profileImage) {
      profileImage.src = e.target.result;
      showNotification('Success', 'Profile picture updated successfully!', 'success');
    }
  };
  
  reader.readAsDataURL(file);
  
  // In a real app, you would:
  // - Upload the file to a server
  // - Update the user's profile in the database
  // - Handle upload progress and errors
}

// Show notification function
function showNotification(title, message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-header">
      <h4>${title}</h4>
      <button class="notification-close">&times;</button>
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
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
  }
}

// Add notification styles to the page
function addNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .notification-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
      float: right;
      margin-top: -8px;
    }
    
    .notification-close:hover {
      color: #374151;
    }
    
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .notification-header h4 {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
    }
    
    .notification p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addNotificationStyles();
  initializeProfile();
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeProfile,
    handleEditProfile,
    handleChangePassword,
    handleAvatarEdit,
    showNotification
  };
}

// جلب الأزرار
const logoutBtn = document.getElementById('logoutBtn');
const drawerLogout = document.getElementById('drawerLogout');

// دالة تسجيل الخروج
function logout() {
  // مثال: مسح بيانات الجلسة
  localStorage.clear();
  sessionStorage.clear();

  // إعادة توجيه لصفحة تسجيل الدخول
  window.location.href = 'login.html'; // غير الرابط حسب صفحتك
}

// ربط الأزرار بالدالة
logoutBtn.addEventListener('click', logout);
drawerLogout.addEventListener('click', logout);

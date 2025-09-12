// Customer Records Management
class CustomerRecords {
  constructor() {
    this.cases = JSON.parse(localStorage.getItem('customerCases')) || [];
    this.currentEditId = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderTable();
  }

  bindEvents() {
    // Add Case Button
    document.getElementById('addCaseBtn').addEventListener('click', () => this.openModal());

    // Modal Events
    document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modalOverlay')) this.closeModal();
    });

    // Form Submission
    document.getElementById('caseForm').addEventListener('submit', (e) => this.handleSubmit(e));

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('modalOverlay').classList.contains('show')) {
        this.closeModal();
      }
    });
  }

  openModal(caseId = null) {
    const modal = document.getElementById('modalOverlay');
    const form = document.getElementById('caseForm');
    const title = document.getElementById('modalTitle');

    if (caseId) {
      this.currentEditId = caseId;
      const caseData = this.cases.find(c => c.id === caseId);
      if (caseData) {
        this.populateForm(caseData);
        title.textContent = 'Edit Case';
      }
    } else {
      this.currentEditId = null;
      form.reset();
      this.clearErrors();
      title.textContent = 'Add Case';
    }

    modal.classList.add('show');
  }

  closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    this.currentEditId = null;
  }

  populateForm(caseData) {
    document.getElementById('fullName').value = caseData.fullName;
    document.getElementById('nationalId').value = caseData.nationalId;
    document.getElementById('phone').value = caseData.phone;
    document.getElementById('email').value = caseData.email;
    document.getElementById('amountDue').value = caseData.amountDue;
    document.getElementById('reason').value = caseData.reason;
    document.getElementById('dueDate').value = caseData.dueDate;
    document.getElementById('status').value = caseData.status;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      const formData = this.getFormData();
      if (this.currentEditId) {
        this.updateCase(this.currentEditId, formData);
      } else {
        this.addCase(formData);
      }
      this.saveToStorage();
      this.renderTable();
      this.closeModal();
    }
  }

  validateForm() {
    this.clearErrors();
    let isValid = true;

    const requiredFields = ['fullName', 'nationalId', 'phone', 'amountDue', 'reason', 'dueDate'];
    requiredFields.forEach(field => {
      const element = document.getElementById(field);
      if (!element.value.trim()) {
        this.showError(field, 'This field is required');
        isValid = false;
      }
    });

    // Email validation if provided
    const email = document.getElementById('email').value;
    if (email && !this.isValidEmail(email)) {
      this.showError('email', 'Please enter a valid email');
      isValid = false;
    }

    return isValid;
  }

  showError(field, message) {
    const errorElement = document.getElementById(field + 'Error');
    errorElement.textContent = message;
  }

  clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.textContent = '');
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getFormData() {
    return {
      id: this.currentEditId || Date.now().toString(),
      fullName: document.getElementById('fullName').value.trim(),
      nationalId: document.getElementById('nationalId').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      amountDue: parseFloat(document.getElementById('amountDue').value),
      reason: document.getElementById('reason').value.trim(),
      dueDate: document.getElementById('dueDate').value,
      status: document.getElementById('status').value
    };
  }

  addCase(caseData) {
    this.cases.push(caseData);
  }

  updateCase(id, updatedData) {
    const index = this.cases.findIndex(c => c.id === id);
    if (index !== -1) {
      this.cases[index] = { ...this.cases[index], ...updatedData };
    }
  }

  deleteCase(id) {
    if (confirm('Are you sure you want to delete this case?')) {
      this.cases = this.cases.filter(c => c.id !== id);
      this.saveToStorage();
      this.renderTable();
    }
  }

  saveToStorage() {
    localStorage.setItem('customerCases', JSON.stringify(this.cases));
  }

  renderTable() {
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';

    if (this.cases.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="9" style="text-align: center; padding: 40px; color: #6b7280;">No cases recorded yet. Click "Add Case" to get started.</td>';
      tbody.appendChild(row);
      return;
    }

    this.cases.forEach(caseData => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${caseData.fullName}</td>
        <td>${caseData.nationalId}</td>
        <td>${caseData.phone}</td>
        <td>${caseData.email || '-'}</td>
        <td>$${caseData.amountDue.toFixed(2)}</td>
        <td>${caseData.reason}</td>
        <td>${this.formatDate(caseData.dueDate)}</td>
        <td><span class="status-badge status-${caseData.status.toLowerCase()}">${caseData.status}</span></td>
        <td>
          <button class="action-btn edit-btn" onclick="records.editCase('${caseData.id}')">
            <span class="material-symbols-rounded">edit</span>
          </button>
          <button class="action-btn delete-btn" onclick="records.deleteCase('${caseData.id}')">
            <span class="material-symbols-rounded">delete</span>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  editCase(id) {
    this.openModal(id);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}

// Initialize
const records = new CustomerRecords();

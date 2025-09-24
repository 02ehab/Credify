// Loan Simulator JavaScript

class LoanSimulator {
  constructor() {
    this.currentLoan = {
      amount: 50000,
      interestRate: 6.5,
      term: 30,
      downPayment: 10000
    };

    this.calculations = {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      principal: 0,
      loanToValue: 0
    };

    this.riskScore = 65;
    this.riskLevel = 'Medium';

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeSliders();
    this.calculateLoan();
    this.updateDisplay();
    this.setupAnimations();
  }

  setupEventListeners() {
    // Input fields
    const loanAmount = document.getElementById('loanAmount');
    const interestRate = document.getElementById('interestRate');
    const loanTerm = document.getElementById('loanTerm');
    const downPayment = document.getElementById('downPayment');

    // Sliders
    const loanAmountSlider = document.getElementById('loanAmountSlider');
    const interestRateSlider = document.getElementById('interestRateSlider');
    const loanTermSlider = document.getElementById('loanTermSlider');
    const downPaymentSlider = document.getElementById('downPaymentSlider');

    // Calculate button
    const calculateBtn = document.getElementById('calculateBtn');

    // Add event listeners
    if (loanAmount) {
      loanAmount.addEventListener('input', (e) => {
        this.updateSlider('loanAmount', e.target.value);
        this.currentLoan.amount = parseFloat(e.target.value);
        this.calculateLoan();
      });
    }

    if (interestRate) {
      interestRate.addEventListener('input', (e) => {
        this.updateSlider('interestRate', e.target.value);
        this.currentLoan.interestRate = parseFloat(e.target.value);
        this.calculateLoan();
      });
    }

    if (loanTerm) {
      loanTerm.addEventListener('input', (e) => {
        this.updateSlider('loanTerm', e.target.value);
        this.currentLoan.term = parseInt(e.target.value);
        this.calculateLoan();
      });
    }

    if (downPayment) {
      downPayment.addEventListener('input', (e) => {
        this.updateSlider('downPayment', e.target.value);
        this.currentLoan.downPayment = parseFloat(e.target.value);
        this.calculateLoan();
      });
    }

    // Slider events
    if (loanAmountSlider) {
      loanAmountSlider.addEventListener('input', (e) => {
        this.updateInput('loanAmount', e.target.value);
        this.currentLoan.amount = parseFloat(e.target.value);
        this.calculateLoan();
      });
    }

    if (interestRateSlider) {
      interestRateSlider.addEventListener('input', (e) => {
        this.updateInput('interestRate', e.target.value);
        this.currentLoan.interestRate = parseFloat(e.target.value);
        this.calculateLoan();
      });
    }

    if (loanTermSlider) {
      loanTermSlider.addEventListener('input', (e) => {
        this.updateInput('loanTerm', e.target.value);
        this.currentLoan.term = parseInt(e.target.value);
        this.calculateLoan();
      });
    }

    if (downPaymentSlider) {
      downPaymentSlider.addEventListener('input', (e) => {
        this.updateInput('downPayment', e.target.value);
        this.currentLoan.downPayment = parseFloat(e.target.value);
        this.calculateLoan();
      });
    }

    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => {
        this.calculateLoan();
        this.showCalculationAnimation();
      });
    }
  }

  initializeSliders() {
    this.updateSlider('loanAmount', this.currentLoan.amount);
    this.updateSlider('interestRate', this.currentLoan.interestRate);
    this.updateSlider('loanTerm', this.currentLoan.term);
    this.updateSlider('downPayment', this.currentLoan.downPayment);
  }

  updateSlider(inputId, value) {
    const slider = document.getElementById(inputId + 'Slider');
    if (slider) {
      slider.value = value;
    }
  }

  updateInput(inputId, value) {
    const input = document.getElementById(inputId);
    if (input) {
      input.value = value;
    }
  }

  calculateLoan() {
    const { amount, interestRate, term, downPayment } = this.currentLoan;

    // Calculate monthly payment using loan formula
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = term * 12;

    if (monthlyRate === 0) {
      this.calculations.monthlyPayment = amount / numberOfPayments;
    } else {
      this.calculations.monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    this.calculations.totalPayment = this.calculations.monthlyPayment * numberOfPayments;
    this.calculations.totalInterest = this.calculations.totalPayment - amount;
    this.calculations.principal = amount;
    this.calculations.loanToValue = ((amount - downPayment) / amount) * 100;

    this.calculateRisk();
    this.updateDisplay();
    this.updateScenarioComparison();
  }

  calculateRisk() {
    const { amount, interestRate, term, downPayment } = this.currentLoan;
    const propertyValue = amount; // Assuming loan amount represents property value for LTV calculation
    const loanToValue = ((amount - downPayment) / propertyValue) * 100;
    const debtToIncome = this.getDebtToIncomeRatio();
    const creditScore = this.getCreditScore();

    // Risk calculation algorithm
    let riskScore = 50; // Base score

    // LTV impact (lower LTV = lower risk)
    if (loanToValue < 60) riskScore += 25;
    else if (loanToValue < 80) riskScore += 10;
    else if (loanToValue > 95) riskScore -= 20;

    // Interest rate impact
    if (interestRate < 5) riskScore += 15;
    else if (interestRate > 10) riskScore -= 15;

    // Term impact (shorter term = lower risk)
    if (term <= 15) riskScore += 10;
    else if (term >= 30) riskScore -= 5;

    // Credit score impact
    if (creditScore > 750) riskScore += 20;
    else if (creditScore < 650) riskScore -= 20;

    // DTI impact
    if (debtToIncome < 36) riskScore += 15;
    else if (debtToIncome > 50) riskScore -= 25;

    this.riskScore = Math.max(0, Math.min(100, riskScore));
    this.updateRiskLevel();
  }

  updateRiskLevel() {
    if (this.riskScore >= 80) {
      this.riskLevel = 'Low';
    } else if (this.riskScore >= 60) {
      this.riskLevel = 'Medium';
    } else if (this.riskScore >= 40) {
      this.riskLevel = 'High';
    } else {
      this.riskLevel = 'Very High';
    }
  }

  getDebtToIncomeRatio() {
    // Mock DTI calculation - in real app this would come from user profile
    return 35; // 35% DTI
  }

  getCreditScore() {
    // Mock credit score - in real app this would come from user profile
    return 720; // Good credit score
  }

  updateDisplay() {
    // Update results display
    const monthlyPayment = document.getElementById('monthlyPayment');
    const totalPayment = document.getElementById('totalPayment');
    const totalInterest = document.getElementById('totalInterest');
    const principalAmount = document.getElementById('principalAmount');
    const loanToValue = document.getElementById('loanToValue');

    if (monthlyPayment) monthlyPayment.textContent = this.formatCurrency(this.calculations.monthlyPayment);
    if (totalPayment) totalPayment.textContent = this.formatCurrency(this.calculations.totalPayment);
    if (totalInterest) totalInterest.textContent = this.formatCurrency(this.calculations.totalInterest);
    if (principalAmount) principalAmount.textContent = this.formatCurrency(this.calculations.principal);
    if (loanToValue) loanToValue.textContent = this.calculations.loanToValue.toFixed(1) + '%';

    // Update risk display
    const riskValue = document.getElementById('riskValue');
    const riskScore = document.getElementById('riskScore');
    const riskDescription = document.getElementById('riskDescription');

    if (riskValue) riskValue.textContent = this.riskLevel;
    if (riskScore) riskScore.textContent = this.riskScore + '/100';
    if (riskDescription) riskDescription.textContent = this.getRiskDescription();

    // Update risk circle color
    this.updateRiskCircle();
  }

  updateRiskCircle() {
    const riskCircle = document.getElementById('riskCircle');
    if (!riskCircle) return;

    let color;
    if (this.riskScore >= 80) color = '#10b981'; // Green
    else if (this.riskScore >= 60) color = '#f59e0b'; // Yellow
    else if (this.riskScore >= 40) color = '#f97316'; // Orange
    else color = '#ef4444'; // Red

    riskCircle.style.borderColor = color;
    riskCircle.style.color = color;
  }

  getRiskDescription() {
    const descriptions = {
      'Low': 'This loan has a low risk level. You have a strong financial profile and good chances of approval.',
      'Medium': 'This loan has a moderate risk level. Consider reducing the loan amount or increasing down payment to improve your risk profile.',
      'High': 'This loan has a high risk level. You may face challenges getting approved or may receive less favorable terms.',
      'Very High': 'This loan has a very high risk level. Consider significant changes to improve your loan profile or consult with a financial advisor.'
    };

    return descriptions[this.riskLevel] || 'Risk level assessment not available.';
  }

  updateScenarioComparison() {
    // Current scenario (already calculated)
    const currentMonthly = document.getElementById('currentMonthly');
    const currentInterest = document.getElementById('currentInterest');
    const currentRisk = document.getElementById('currentRisk');

    if (currentMonthly) currentMonthly.textContent = this.formatCurrency(this.calculations.monthlyPayment);
    if (currentInterest) currentInterest.textContent = this.formatCurrency(this.calculations.totalInterest);
    if (currentRisk) currentRisk.textContent = this.riskLevel;

    // Alternative scenario (recommended)
    const altMonthly = document.getElementById('altMonthly');
    const altInterest = document.getElementById('altInterest');
    const altRisk = document.getElementById('altRisk');

    // Calculate alternative scenario (20% down payment, 15-year term)
    const altLoan = { ...this.currentLoan };
    altLoan.downPayment = this.currentLoan.amount * 0.2; // 20% down payment
    altLoan.term = 15; // 15-year term

    const altCalculations = this.calculateAlternativeScenario(altLoan);

    if (altMonthly) altMonthly.textContent = this.formatCurrency(altCalculations.monthlyPayment);
    if (altInterest) altInterest.textContent = this.formatCurrency(altCalculations.totalInterest);
    if (altRisk) altRisk.textContent = altCalculations.riskLevel;
  }

  calculateAlternativeScenario(loan) {
    const monthlyRate = loan.interestRate / 100 / 12;
    const numberOfPayments = loan.term * 12;
    const loanAmount = loan.amount - loan.downPayment;

    let monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / numberOfPayments;
    } else {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    // Risk calculation for alternative scenario
    const loanToValue = ((loan.amount - loan.downPayment) / loan.amount) * 100;
    let riskScore = 50;

    if (loanToValue < 60) riskScore += 25;
    else if (loanToValue < 80) riskScore += 10;

    if (loan.term <= 15) riskScore += 10;

    riskScore = Math.max(0, Math.min(100, riskScore));
    let riskLevel = 'Medium';
    if (riskScore >= 80) riskLevel = 'Low';
    else if (riskScore < 60) riskLevel = 'High';

    return {
      monthlyPayment,
      totalInterest,
      riskLevel
    };
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  setupAnimations() {
    // Animate form inputs on load
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
      group.style.opacity = '0';
      group.style.transform = 'translateY(20px)';

      setTimeout(() => {
        group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        group.style.opacity = '1';
        group.style.transform = 'translateY(0)';
      }, index * 100);
    });

    // Animate results on load
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';

      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 800 + (index * 100));
    });
  }

  showCalculationAnimation() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (!calculateBtn) return;

    // Add loading state
    const originalText = calculateBtn.innerHTML;
    calculateBtn.innerHTML = '<span class="material-symbols-rounded">sync</span> Calculating...';
    calculateBtn.disabled = true;

    // Animate button
    calculateBtn.style.transform = 'scale(0.95)';

    setTimeout(() => {
      calculateBtn.innerHTML = originalText;
      calculateBtn.disabled = false;
      calculateBtn.style.transform = 'scale(1)';

      // Show success notification
      this.showNotification('✅ Loan calculation completed successfully!');
    }, 1500);
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'simulator-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1e293b;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-weight: 500;
      max-width: 300px;
      word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Add preset scenarios
  loadPresetScenario(scenario) {
    const presets = {
      'firstTimeBuyer': {
        amount: 300000,
        interestRate: 6.8,
        term: 30,
        downPayment: 20000
      },
      'refinance': {
        amount: 250000,
        interestRate: 5.5,
        term: 20,
        downPayment: 50000
      },
      'investment': {
        amount: 150000,
        interestRate: 7.2,
        term: 25,
        downPayment: 30000
      }
    };

    if (presets[scenario]) {
      this.currentLoan = { ...presets[scenario] };
      this.initializeSliders();
      this.calculateLoan();
      this.showNotification(`📋 Loaded ${scenario} scenario`);
    }
  }

  // Export results
  exportResults() {
    const results = {
      loan: this.currentLoan,
      calculations: this.calculations,
      risk: {
        score: this.riskScore,
        level: this.riskLevel
      },
      timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `loan_simulation_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    this.showNotification('📊 Results exported successfully!');
  }
}

// Initialize the simulator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const simulator = new LoanSimulator();

  // Add preset scenario buttons (optional)
  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      simulator.loadPresetScenario(e.target.dataset.preset);
    });
  });

  // Add export functionality
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      simulator.exportResults();
    });
  }
});

// Utility functions
const SimulatorUtils = {
  // Calculate loan payment
  calculatePayment(principal, rate, term) {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },

  // Calculate risk score
  calculateRiskScore(loanAmount, downPayment, interestRate, term, creditScore, dti) {
    const loanToValue = ((loanAmount - downPayment) / loanAmount) * 100;
    let riskScore = 50;

    if (loanToValue < 60) riskScore += 25;
    else if (loanToValue < 80) riskScore += 10;
    else if (loanToValue > 95) riskScore -= 20;

    if (interestRate < 5) riskScore += 15;
    else if (interestRate > 10) riskScore -= 15;

    if (term <= 15) riskScore += 10;
    else if (term >= 30) riskScore -= 5;

    if (creditScore > 750) riskScore += 20;
    else if (creditScore < 650) riskScore -= 20;

    if (dti < 36) riskScore += 15;
    else if (dti > 50) riskScore -= 25;

    return Math.max(0, Math.min(100, riskScore));
  }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LoanSimulator, SimulatorUtils };
}

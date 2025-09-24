// Financial Health Dashboard JavaScript

class FinancialHealthDashboard {
  constructor() {
    this.score = 750;
    this.maxScore = 850;
    this.minScore = 300;
    this.scoreChange = 25;
    this.init();
  }

  init() {
    this.animateScoreCircle();
    this.setupEventListeners();
    this.updateScoreDisplay();
    this.animateProgressBars();
  }

  animateScoreCircle() {
    const circle = document.getElementById('scoreCircle');
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreChange = document.getElementById('scoreChange');

    if (!circle || !scoreNumber || !scoreChange) return;

    // Calculate percentage for the circle
    const percentage = (this.score - this.minScore) / (this.maxScore - this.minScore) * 100;

    // Update circle gradient
    const angle = (percentage / 100) * 360;
    circle.style.background = `conic-gradient(from 0deg, #16a34a 0%, #22c55e ${angle}deg, #e5e7eb ${angle}deg, #e5e7eb 100%)`;

    // Animate score number
    this.animateNumber(scoreNumber, this.score);

    // Update score change
    scoreChange.textContent = `+${this.scoreChange} points`;
  }

  animateNumber(element, targetValue, duration = 2000) {
    const startValue = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);

      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  updateScoreDisplay() {
    // Update score breakdown values
    const breakdownValues = [95, 78, 85, 92];
    const breakdownElements = document.querySelectorAll('.breakdown-value');

    breakdownElements.forEach((element, index) => {
      if (breakdownValues[index]) {
        element.textContent = `${breakdownValues[index]}%`;
      }
    });
  }

  animateProgressBars() {
    const progressBars = document.querySelectorAll('.breakdown-fill, .progress-fill');

    progressBars.forEach((bar, index) => {
      // Get the target width from style attribute
      const targetWidth = bar.style.width || '0%';
      bar.style.width = '0%';

      // Animate to target width
      setTimeout(() => {
        bar.style.transition = 'width 1.5s ease-out';
        bar.style.width = targetWidth;
      }, index * 200);
    });
  }

  setupEventListeners() {
    // Add click handlers for tip action buttons
    const tipButtons = document.querySelectorAll('.tip-action .btn');
    tipButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleTipAction(e.target.textContent.trim());
      });
    });

    // Add hover effects for cards
    const cards = document.querySelectorAll('.tip-card, .goal-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Add click handler for score circle
    const scoreCircle = document.getElementById('scoreCircle');
    if (scoreCircle) {
      scoreCircle.addEventListener('click', () => {
        this.refreshScore();
      });
    }
  }

  handleTipAction(action) {
    // Simulate different actions based on button text
    const actions = {
      'View Strategy': () => this.showStrategyModal(),
      'Learn How': () => this.showTutorial(),
      'Explore Options': () => this.showOptions(),
      'Get Free Report': () => this.getFreeReport()
    };

    if (actions[action]) {
      actions[action]();
    } else {
      console.log(`Action: ${action}`);
      this.showNotification(`Opening ${action}...`);
    }
  }

  showStrategyModal() {
    this.showNotification('Credit utilization strategy guide opened!');
    // In a real app, this would open a modal with detailed strategy
  }

  showTutorial() {
    this.showNotification('Auto-payment tutorial started!');
    // In a real app, this would start an interactive tutorial
  }

  showOptions() {
    this.showNotification('Credit options explorer opened!');
    // In a real app, this would show different credit options
  }

  getFreeReport() {
    this.showNotification('Redirecting to free credit report...');
    // In a real app, this would redirect to AnnualCreditReport.com or similar
  }

  refreshScore() {
    // Simulate score refresh
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreNumber = document.getElementById('scoreNumber');

    if (!scoreCircle || !scoreNumber) return;

    scoreCircle.style.transform = 'scale(0.95)';
    scoreCircle.style.opacity = '0.8';

    setTimeout(() => {
      // Generate a new random score change
      const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
      this.scoreChange = change;
      this.score = Math.max(this.minScore, Math.min(this.maxScore, this.score + change));

      this.animateScoreCircle();
      this.showNotification(`Score refreshed! ${change > 0 ? '+' : ''}${change} points`);

      // Reset animation
      scoreCircle.style.transform = 'scale(1)';
      scoreCircle.style.opacity = '1';
    }, 500);
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
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
    }, 3000);
  }

  // Add some dynamic effects
  addDynamicEffects() {
    // Add parallax effect to score circle on scroll
    const scoreCircle = document.getElementById('scoreCircle');
    if (scoreCircle) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        scoreCircle.style.transform = `translateY(${rate}px)`;
      });
    }

    // Add typing effect to page description
    const description = document.querySelector('.page-description');
    if (description) {
      this.typeWriter(description, description.textContent, 50);
    }
  }

  typeWriter(element, text, delay = 100) {
    element.textContent = '';
    let i = 0;

    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
  }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new FinancialHealthDashboard();

  // Add dynamic effects after a short delay
  setTimeout(() => {
    dashboard.addDynamicEffects();
  }, 1000);
});

// Add some utility functions for potential future use
const FinancialHealthUtils = {
  // Calculate credit score color based on score
  getScoreColor(score) {
    if (score >= 750) return '#16a34a'; // Green
    if (score >= 650) return '#ca8a04'; // Yellow
    return '#dc2626'; // Red
  },

  // Format score change
  formatScoreChange(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change} points`;
  },

  // Calculate score percentage
  calculateScorePercentage(score, min = 300, max = 850) {
    return ((score - min) / (max - min)) * 100;
  }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FinancialHealthDashboard, FinancialHealthUtils };
}

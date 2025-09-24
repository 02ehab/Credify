// Rewards & Trust Dashboard JavaScript

class RewardsTrustDashboard {
  constructor() {
    this.points = 2847;
    this.level = 'Gold';
    this.nextLevelPoints = 3500;
    this.trustScore = 78;
    this.init();
  }

  init() {
    this.animatePointsCircle();
    this.updateTrustMeter();
    this.setupEventListeners();
    this.animateCounters();
    this.addInteractiveEffects();
  }

  animatePointsCircle() {
    const circle = document.getElementById('pointsCircle');
    const pointsNumber = document.getElementById('pointsNumber');

    if (!circle || !pointsNumber) return;

    // Calculate percentage for the circle (based on progress to next level)
    const percentage = (this.points / this.nextLevelPoints) * 100;
    const angle = (percentage / 100) * 360;

    // Update circle gradient
    circle.style.background = `conic-gradient(from 0deg, #a855f7 0%, #c084fc ${angle}deg, #e5e7eb ${angle}deg, #e5e7eb 100%)`;

    // Animate points number
    this.animateNumber(pointsNumber, this.points);
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

      // Format number with commas
      element.textContent = this.formatNumber(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  updateTrustMeter() {
    const trustFill = document.querySelector('.trust-fill');
    const trustValue = document.querySelector('.trust-value');

    if (!trustFill || !trustValue) return;

    // Animate trust meter
    setTimeout(() => {
      trustFill.style.width = `${this.trustScore}%`;
      trustValue.textContent = `${this.trustScore}/100`;
    }, 500);
  }

  animateCounters() {
    // Animate benefit cards on scroll
    const benefitCards = document.querySelectorAll('.benefit-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    benefitCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
    });
  }

  setupEventListeners() {
    // Add click handlers for benefit cards
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
      card.addEventListener('click', () => {
        this.handleBenefitClick(card);
      });
    });

    // Add click handlers for earning cards
    const earningCards = document.querySelectorAll('.earning-card');
    earningCards.forEach(card => {
      card.addEventListener('click', () => {
        this.handleEarningClick(card);
      });
    });

    // Add click handler for points circle
    const pointsCircle = document.getElementById('pointsCircle');
    if (pointsCircle) {
      pointsCircle.addEventListener('click', () => {
        this.refreshPoints();
      });
    }

    // Add hover effects for activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-4px) scale(1.02)';
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  handleBenefitClick(card) {
    const isUnlocked = card.classList.contains('unlocked');
    const benefitTitle = card.querySelector('h3').textContent;

    if (isUnlocked) {
      this.showNotification(`Opening ${benefitTitle}...`);
      // In a real app, this would open the benefit details or redirect
    } else {
      this.showNotification(`🔒 ${benefitTitle} is locked. Earn more points to unlock!`);
    }
  }

  handleEarningClick(card) {
    const rewardText = card.querySelector('.earning-reward').textContent;
    const activityTitle = card.querySelector('h3').textContent;

    this.showNotification(`💡 ${activityTitle}: ${rewardText}`);
    // In a real app, this might show more details about the earning method
  }

  refreshPoints() {
    // Simulate points refresh
    const pointsCircle = document.getElementById('pointsCircle');
    const pointsNumber = document.getElementById('pointsNumber');

    if (!pointsCircle || !pointsNumber) return;

    pointsCircle.style.transform = 'scale(0.95)';
    pointsCircle.style.opacity = '0.8';

    setTimeout(() => {
      // Generate random points gain
      const pointsGain = Math.floor(Math.random() * 50) + 10;
      this.points += pointsGain;

      this.animatePointsCircle();
      this.showNotification(`+${pointsGain} points earned! 🎉`);

      // Reset animation
      pointsCircle.style.transform = 'scale(1)';
      pointsCircle.style.opacity = '1';
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

  addInteractiveEffects() {
    // Add parallax effect to points circle
    const pointsCircle = document.getElementById('pointsCircle');
    if (pointsCircle) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        pointsCircle.style.transform = `translateY(${rate}px)`;
      });
    }

    // Add typing effect to page description
    const description = document.querySelector('.page-description');
    if (description) {
      this.typeWriter(description, description.textContent, 50);
    }

    // Add level progress animation
    this.animateLevelProgress();
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

  animateLevelProgress() {
    const levelProgress = document.querySelector('.level-progress');
    if (!levelProgress) return;

    const percentage = (this.points / this.nextLevelPoints) * 100;
    const progressText = `${Math.round(percentage)}% to ${this.getNextLevel()}`;

    // Animate the progress text
    setTimeout(() => {
      levelProgress.textContent = progressText;
      levelProgress.style.opacity = '1';
    }, 1000);
  }

  getNextLevel() {
    if (this.points < 1000) return 'Silver';
    if (this.points < 2500) return 'Gold';
    return 'Platinum';
  }

  // Add leaderboard animations
  animateLeaderboard() {
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');

    leaderboardItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';

      setTimeout(() => {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 200);
    });
  }

  // Add points earning simulation
  simulatePointsEarning() {
    // This could be called periodically to simulate real-time points earning
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        const pointsGain = Math.floor(Math.random() * 20) + 5;
        this.points += pointsGain;
        this.animatePointsCircle();
        this.showNotification(`+${pointsGain} points earned from activity!`);
      }
    }, 30000); // Check every 30 seconds
  }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new RewardsTrustDashboard();

  // Add leaderboard animation after a delay
  setTimeout(() => {
    dashboard.animateLeaderboard();
  }, 1500);

  // Optional: Enable points earning simulation (uncomment if desired)
  // dashboard.simulatePointsEarning();
});

// Add utility functions for potential future use
const RewardsTrustUtils = {
  // Calculate level based on points
  getLevel(points) {
    if (points >= 3500) return 'Platinum';
    if (points >= 1500) return 'Gold';
    if (points >= 500) return 'Silver';
    return 'Bronze';
  },

  // Get level color
  getLevelColor(level) {
    const colors = {
      'Bronze': '#cd7f32',
      'Silver': '#c0c0c0',
      'Gold': '#ffd700',
      'Platinum': '#e5e4e2'
    };
    return colors[level] || '#6366f1';
  },

  // Format points with appropriate suffix
  formatPoints(points) {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
    return points.toString();
  },

  // Calculate trust score based on various factors
  calculateTrustScore(activities) {
    // This would be a complex calculation based on user behavior
    // For demo purposes, return a random score between 70-95
    return Math.floor(Math.random() * 25) + 70;
  }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RewardsTrustDashboard, RewardsTrustUtils };
}

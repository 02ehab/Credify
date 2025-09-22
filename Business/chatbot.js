// Chat state for session memory
const CHAT_STATE = {
  userName: sessionStorage.getItem("chat_user_name") || null,
  lastIntent: null
};

function toggleChatbox() {
  const popup = document.getElementById("chatPopup");
  popup.classList.toggle("hidden");
}

function ensureSuggestionsContainer() {
  const popup = document.getElementById("chatPopup");
  let suggestions = document.getElementById("chatSuggestions");
  if (!suggestions) {
    suggestions = document.createElement("div");
    suggestions.id = "chatSuggestions";
    suggestions.style.display = "flex";
    suggestions.style.flexWrap = "wrap";
    suggestions.style.gap = "6px";
    suggestions.style.margin = "6px 0";
    const input = document.getElementById("chatInput");
    popup.insertBefore(suggestions, input);
  }
  return suggestions;
}

function setSuggestions(labels) {
  const container = ensureSuggestionsContainer();
  container.innerHTML = "";
  if (!labels || !labels.length) return;
  labels.slice(0, 6).forEach(label => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.style.background = "#e2e8f0";
    btn.style.color = "#475569";
    btn.style.border = "1px solid #cbd5e1";
    btn.style.borderRadius = "16px";
    btn.style.padding = "6px 12px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "12px";
    btn.style.fontWeight = "500";
    btn.style.transition = "all 0.3s ease";
    btn.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    btn.onclick = () => {
      const input = document.getElementById("chatInput");
      input.value = label;
      sendChatMessage();
    };
    container.appendChild(btn);
  });
}

function appendMessage(role, text, isHTML) {
  const chatBox = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  if (isHTML) {
    msg.innerHTML = text;
  } else {
    msg.textContent = text;
  }
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

function typingIndicator() {
  return appendMessage("bot", "Typing...", false);
}

function normalize(text) {
  return (text || "").toLowerCase().trim();
}

function tryExtractName(englishText) {
  // Examples: "My name is John", "I am Sarah", "I'm Michael"
  const patterns = [
    /my name is\s+([A-Za-z]+)\b/,
    /i am\s+([A-Za-z]+)\b/,
    /i'm\s+([A-Za-z]+)\b/
  ];
  for (const p of patterns) {
    const m = englishText.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

function smartReply(rawMsg) {
  const msg = normalize(rawMsg);

  // Capture the name and store it
  const possibleName = tryExtractName(rawMsg);
  if (possibleName) {
    CHAT_STATE.userName = possibleName;
    sessionStorage.setItem("chat_user_name", possibleName);
  }

  // Common intents for credit management
  const intents = [
    {
      name: "greet",
      test: () => /(hello|hi|hey|greetings|good morning|good afternoon)/i.test(rawMsg),
      reply: () => {
        const name = CHAT_STATE.userName ? `, ${CHAT_STATE.userName}` : "";
        return {
          html: `🤖 Hello${name}! Welcome to Nebify. How can I assist you with your credit management today?`,
          suggestions: ["Credit Score", "Portfolio", "Risk Assessment", "Account Help"]
        };
      }
    },
    {
      name: "credit_score",
      test: () => /(credit score|score|credit rating|credit report)/i.test(rawMsg),
      reply: () => ({
        html: `📊 You can check your credit score and detailed report from the <a href="credit-overview.html" target="_blank">Credit Overview</a> page. Would you like help understanding your score factors?`,
        suggestions: ["Score Factors", "Improve Score", "Credit Report", "Monitoring"]
      })
    },
    {
      name: "portfolio",
      test: () => /(portfolio|accounts|investments|assets)/i.test(rawMsg),
      reply: () => ({
        html: `📈 Access your complete portfolio dashboard at <a href="credit-overview.html" target="_blank">Credit Overview</a>. You can monitor all your accounts, track performance, and get insights in real-time.`,
        suggestions: ["Account Details", "Performance", "Risk Analysis", "Reports"]
      })
    },
    {
      name: "risk_assessment",
      test: () => /(risk|assessment|analysis|evaluate|rating)/i.test(rawMsg),
      reply: () => ({
        html: `⚡ Our advanced risk assessment tools are available in your <a href="credit-overview.html" target="_blank">dashboard</a>. Get real-time risk scores, predictive analytics, and actionable recommendations.`,
        suggestions: ["Risk Score", "Predictive Analysis", "Recommendations", "Alerts"]
      })
    },
    {
      name: "account_help",
      test: () => /(account|login|access|help|support|trouble)/i.test(rawMsg),
      reply: () => ({
        html: `🔐 For account-related assistance, visit your <a href="profile.html" target="_blank">Profile</a> page or <a href="login.html" target="_blank">sign in</a> if you're not already logged in. What specific help do you need?`,
        suggestions: ["Reset Password", "Account Settings", "Login Help", "Contact Support"]
      })
    },
    {
      name: "register",
      test: () => /(register|signup|join|create account|new account)/i.test(rawMsg),
      reply: () => ({
        html: `📝 Ready to get started? Create your account at our <a href="register.html" target="_blank">registration page</a>. Already have an account? <a href="login.html" target="_blank">Sign in here</a>.`,
        suggestions: ["Sign In", "Account Setup", "Features", "Pricing"]
      })
    },
    {
      name: "login",
      test: () => /(login|signin|sign in|access account)/i.test(rawMsg),
      reply: () => ({
        html: `🔑 Sign in to your account <a href="login.html" target="_blank">here</a> to access all features including real-time monitoring, detailed analytics, and personalized insights.`,
        suggestions: ["Forgot Password", "Create Account", "Account Help"]
      })
    },
    {
      name: "password_reset",
      test: () => /(forgot password|reset password|lost password|password help)/i.test(rawMsg),
      reply: () => ({
        html: `🔁 Reset your password securely from our <a href="login.html" target="_blank">login page</a>. Click "Forgot Password" to receive reset instructions via email.`,
        suggestions: ["Sign In", "Create Account", "Support"]
      })
    },
    {
      name: "notifications",
      test: () => /(notifications|alerts|updates|messages)/i.test(rawMsg),
      reply: () => ({
        html: `🔔 Manage your notifications and alerts in the <a href="notifications.html" target="_blank">Notifications</a> section. Set up real-time alerts for score changes, risk factors, and important updates.`,
        suggestions: ["Alert Settings", "Credit Alerts", "Risk Alerts", "Email Preferences"]
      })
    },
    {
      name: "reports",
      test: () => /(reports|analytics|insights|data|statistics)/i.test(rawMsg),
      reply: () => ({
        html: `📊 Access comprehensive reports and analytics in your <a href="credit-overview.html" target="_blank">Credit Overview</a>. Get detailed insights, trends, and performance metrics for informed decision-making.`,
        suggestions: ["Monthly Reports", "Trend Analysis", "Performance", "Custom Reports"]
      })
    },
    {
      name: "improve_score",
      test: () => /(improve|increase|boost|raise|better|enhance)/i.test(rawMsg),
      reply: () => ({
        html: `💡 Improving your credit score takes time and consistent effort. Key factors include: timely payments, low credit utilization, credit history length, and diverse account types. Check our <a href="credit-overview.html" target="_blank">dashboard</a> for personalized tips.`,
        suggestions: ["Score Factors", "Best Practices", "Timeline", "Professional Help"]
      })
    },
    {
      name: "payment_history",
      test: () => /(payment|payments|history|record|delinquent|late)/i.test(rawMsg),
      reply: () => ({
        html: `💳 Payment history is crucial for your credit score (35% weight). Always pay on time and consider automatic payments. Review your payment history in the <a href="credit-overview.html" target="_blank">Credit Overview</a> section.`,
        suggestions: ["Payment Tips", "Auto-Pay Setup", "Late Payments", "Credit Impact"]
      })
    },
    {
      name: "credit_utilization",
      test: () => /(utilization|balance|debt|ratio|limit)/i.test(rawMsg),
      reply: () => ({
        html: `📈 Credit utilization (30% of score) should stay below 30%. High utilization signals risk to lenders. Monitor your utilization ratio in real-time through our <a href="credit-overview.html" target="_blank">dashboard</a>.`,
        suggestions: ["Utilization Tips", "Debt Management", "Limit Increases", "Payoff Strategies"]
      })
    },
    {
      name: "new_credit",
      test: () => /(new credit|application|inquiry|hard pull|new account)/i.test(rawMsg),
      reply: () => ({
        html: `🔍 New credit applications create hard inquiries that temporarily lower your score. Space out applications and only apply when necessary. Track inquiries in your <a href="credit-overview.html" target="_blank">Credit Overview</a>.`,
        suggestions: ["When to Apply", "Inquiry Impact", "Rate Shopping", "Account Management"]
      })
    },
    {
      name: "credit_mix",
      test: () => /(mix|diversity|types|variety|accounts)/i.test(rawMsg),
      reply: () => ({
        html: `🎯 A diverse credit mix (10% of score) shows you can handle different types of credit responsibly. This includes credit cards, loans, and mortgages. Our analytics can help optimize your credit mix.`,
        suggestions: ["Account Types", "Balance Strategy", "Risk Assessment", "Portfolio Tips"]
      })
    },
    {
      name: "disputes",
      test: () => /(dispute|error|mistake|incorrect|wrong|fix)/i.test(rawMsg),
      reply: () => ({
        html: `⚖️ Found an error on your credit report? Use our <a href="disputes.html" target="_blank">Disputes</a> tool to file and track disputes with credit bureaus. We guide you through the entire process.`,
        suggestions: ["File Dispute", "Track Status", "Common Errors", "Success Rate"]
      })
    },
    {
      name: "monitoring",
      test: () => /(monitor|watch|track|surveillance|alerts)/i.test(rawMsg),
      reply: () => ({
        html: `👁️ 24/7 credit monitoring is essential for early detection of issues. Set up alerts for score changes, new accounts, and suspicious activity in your <a href="notifications.html" target="_blank">Notifications</a> settings.`,
        suggestions: ["Alert Setup", "Real-time Updates", "Security", "Fraud Protection"]
      })
    },
    {
      name: "fraud",
      test: () => /(fraud|identity theft|stolen|security|protection)/i.test(rawMsg),
      reply: () => ({
        html: `🛡️ Fraud protection is critical. If you suspect identity theft, immediately review your <a href="credit-overview.html" target="_blank">full report</a> and file a dispute. We also recommend placing fraud alerts with credit bureaus.`,
        suggestions: ["Fraud Alerts", "Identity Theft", "Security Tips", "Recovery Steps"]
      })
    },
    {
      name: "pricing",
      test: () => /(pricing|cost|fees|plans|subscription|payment)/i.test(rawMsg),
      reply: () => ({
        html: `💰 View our enterprise pricing plans and features on the <a href="#pricing" target="_blank">Pricing</a> section. We offer flexible plans for institutions of all sizes with volume discounts available.`,
        suggestions: ["Compare Plans", "Enterprise", "Free Trial", "Custom Pricing"]
      })
    },
    {
      name: "features",
      test: () => /(features|capabilities|tools|functions|what can you do)/i.test(rawMsg),
      reply: () => ({
        html: `🚀 Nebify offers comprehensive credit management tools: real-time monitoring, predictive analytics, risk assessment, automated reporting, and expert insights. Explore all features in our <a href="#features" target="_blank">Features</a> section.`,
        suggestions: ["Monitoring", "Analytics", "Risk Assessment", "Reporting"]
      })
    },
    {
      name: "contact",
      test: () => /(contact|support|help|talk|speak|reach)/i.test(rawMsg),
      reply: () => ({
        html: `📞 Need personalized assistance? Contact our support team through the <a href="#contact" target="_blank">Contact</a> section or email us directly. Enterprise clients get priority support and dedicated account managers.`,
        suggestions: ["Email Support", "Phone Support", "Account Manager", "Documentation"]
      })
    },
    {
      name: "thanks",
      test: () => /(thanks|thank you|appreciate|grateful)/i.test(rawMsg),
      reply: () => ({
        html: `🙏 You're very welcome! Is there anything else I can help you with regarding your credit management?`,
        suggestions: ["Credit Score", "Portfolio", "Risk Assessment", "Account Help"]
      })
    }
  ];

  for (const it of intents) {
    if (it.test()) {
      CHAT_STATE.lastIntent = it.name;
      return it.reply();
    }
  }

  // Default smart response
  const name = CHAT_STATE.userName ? `, ${CHAT_STATE.userName}` : "";
  return {
    html: `🤖 I didn't understand your question${name}. Try using keywords like: "credit score", "portfolio", "risk assessment", or "account help".`,
    suggestions: ["Credit Score", "Portfolio", "Risk Assessment", "Account Help"]
  };
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message, false);
  const typing = typingIndicator();
  input.value = "";

  const { html, suggestions } = smartReply(message);

  setTimeout(() => {
    typing.innerHTML = html;
    setSuggestions(suggestions || []);
    const chatBox = document.getElementById("chatMessages");
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 500);
}

// Enter key to send
document.getElementById("chatInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendChatMessage();
  }
});


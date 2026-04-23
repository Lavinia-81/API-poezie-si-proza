async function loadDashboard() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Introdu emailul");
    return;
  }

  const response = await fetch(`/auth/usage/${email}`);
  const data = await response.json();

  if (data.error) {
    alert("Userul nu există. Creează-l mai întâi.");
    return;
  }

  document.getElementById("dashboard").style.display = "block";

  document.getElementById("d-email").innerText = data.email;
  document.getElementById("d-plan").innerText = data.plan;
  document.getElementById("d-requests").innerText = data.requestsToday;
  document.getElementById("d-limit").innerText = data.dailyLimit;
  document.getElementById("d-remaining").innerText = data.remainingRequests;

  document.getElementById("d-key").innerText = data.apiKey || "N/A";
}

async function upgrade(plan) {
  const email = document.getElementById("email").value;

  const response = await fetch("/auth/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, plan })
  });

  const data = await response.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Eroare: " + JSON.stringify(data));
  }
}

async function openPortal() {
  const email = document.getElementById("email").value;

  const response = await fetch("/auth/customer-portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await response.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Eroare: " + JSON.stringify(data));
  }
}



// lanuage toggle and translations
const langToggle = document.getElementById("langToggle");
let currentLang = "en";

const translations = {
  en: {
    navTitle: "API - Dashboard",
    authTitle: "Authentication",
    introText: "This page gives you access to your personal API management panel. Authentication is required to view your active plan, API key, usage limits, and upgrade options. The dashboard allows you to manage your subscription securely and monitor your API usage in real time.",

    accountInfoTitle: "Account Information",
    usageTitle: "API Usage",
    subscriptionTitle: "Subscription Management",

    labelEmail: "Email:",
    labelPlan: "Plan:",
    labelKey: "API Key:",
    labelReqToday: "Requests today:",
    labelLimit: "Daily limit:",
    labelRemaining: "Requests remaining:",

    btnLogin: "Enter Dashboard",
    btnBasic: "Upgrade to BASIC",
    btnPremium: "Upgrade to PREMIUM",
    btnPortal: "Manage subscription",

    emailPlaceholder: "Enter your email"
  },

  ro: {
    navTitle: "API - Bord de control",
    authTitle: "Autentificare",
    introText: "Această pagină îți oferă acces la panoul tău personal de administrare al API‑ului. Autentificarea este necesară pentru a vizualiza planul activ, cheia API, limitele de utilizare și opțiunile de upgrade. Dashboard‑ul îți permite să îți gestionezi abonamentul în siguranță și să urmărești în timp real modul în care folosești resursele API‑ului.",

    accountInfoTitle: "Informații Cont",
    usageTitle: "Utilizare API",
    subscriptionTitle: "Administrare Abonament",

    labelEmail: "Email:",
    labelPlan: "Plan:",
    labelKey: "Cheie API:",
    labelReqToday: "Request-uri azi:",
    labelLimit: "Limită zilnică:",
    labelRemaining: "Request-uri rămase:",

    btnLogin: "Intră în Dashboard",
    btnBasic: "Upgrade la BASIC",
    btnPremium: "Upgrade la PREMIUM",
    btnPortal: "Administrează abonamentul",

    emailPlaceholder: "Introdu emailul"
  }
};

function applyTranslations(lang) {
  document.getElementById("navTitle").innerText = translations[lang].navTitle;
  document.getElementById("authTitle").innerText = translations[lang].authTitle;
  document.getElementById("introText").innerText = translations[lang].introText;

  document.getElementById("accountInfoTitle").innerText = translations[lang].accountInfoTitle;
  document.getElementById("usageTitle").innerText = translations[lang].usageTitle;
  document.getElementById("subscriptionTitle").innerText = translations[lang].subscriptionTitle;

  document.getElementById("labelEmail").innerText = translations[lang].labelEmail;
  document.getElementById("labelPlan").innerText = translations[lang].labelPlan;
  document.getElementById("labelKey").innerText = translations[lang].labelKey;
  document.getElementById("labelReqToday").innerText = translations[lang].labelReqToday;
  document.getElementById("labelLimit").innerText = translations[lang].labelLimit;
  document.getElementById("labelRemaining").innerText = translations[lang].labelRemaining;

  document.getElementById("btnLogin").innerText = translations[lang].btnLogin;
  document.getElementById("btnBasic").innerText = translations[lang].btnBasic;
  document.getElementById("btnPremium").innerText = translations[lang].btnPremium;
  document.getElementById("btnPortal").innerText = translations[lang].btnPortal;

  document.getElementById("email").placeholder = translations[lang].emailPlaceholder;
}

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ro" : "en";
  langToggle.innerText = currentLang === "en" ? "RO" : "EN";
  applyTranslations(currentLang);
});


// change year in footer
document.getElementById("year").textContent = new Date().getFullYear()
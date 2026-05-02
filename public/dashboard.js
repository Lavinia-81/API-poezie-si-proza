// dashboard.js
async function loadDashboard() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert(currentLang === "en" ? "Please enter your email" : "Introdu emailul");
    return;
  }

  // 1. Luăm usage + API key
  const usageRes = await fetch(`/auth/usage/${email}`);
  const usage = await usageRes.json();

  if (usage.error) {
    alert(currentLang === "en" ? "User does not exist" : "Userul nu există");
    return;
  }

  const apiKey = usage.apiKey;

  // 2. Luăm datele complete din /auth/me folosind Bearer
  const meRes = await fetch(`/auth/me?apiKey=${apiKey}`);
  const me = await meRes.json();
  window._meData = me;   // 🔥 asta lipsea
  
  if (me.error) {
    alert("Eroare la /me");
    return;
  }

  // 3. Afișăm dashboard-ul
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("d-email").innerText = me.email;
  document.getElementById("d-plan").innerText = me.plan.toUpperCase();
  document.getElementById("d-requests").innerText = me.requestsToday;
  document.getElementById("d-limit").innerText = me.requestsLimit;
  document.getElementById("d-remaining").innerText = me.remainingRequests;
  document.getElementById("d-key").innerText = apiKey;

  // 4. Dacă userul nu e FREE, dezactivăm butonul de delete și afișăm un mesaj
  const deleteBtn = document.getElementById("btnDelete");
  const deleteWarning = document.getElementById("delete-warning");

  if (window._meData.plan !== "free") {
    deleteBtn.disabled = true;
    deleteBtn.classList.add("disabled");

    deleteWarning.innerText =
      "For security reasons, you cannot delete your account while you have an active subscription. Please cancel your subscription first.";
  } else {
    deleteBtn.disabled = false;
    deleteWarning.innerText = "";
  }

 
  renderCancellationNotice(me);

  console.log("ME DATA:", me);
}


async function upgrade(plan) {
  const email = document.getElementById("email").value;

  const response = await fetch("/create-checkout-session", {
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


function renderCancellationNotice(user) {
  const container = document.getElementById("cancelNotice");
  if (!container) return;

  const pendingBox = container.querySelector(".notice.pending");
  const cancelledBox = container.querySelector(".notice.cancelled");
 
 // const dateSpan = document.getElementById("cancel-date");
  // Ascundem tot la început
  container.classList.add("hidden");
  pendingBox.style.display = "none";
  cancelledBox.style.display = "none";

  // Determinăm limba curentă
  const lang = localStorage.getItem("lang") || "en";
  

  // Mesaje bilingve
  const messages = {
    pending: {
      ro: {
        title: "Abonament în curs de anulare",
        line1: `Ai cerut anularea abonamentului ${user.plan.toUpperCase()}.`,
        line2: "Abonamentul tău va rămâne activ până la finalul perioadei curente de facturare, adică o luna de la data cand ai decis sa anulezi abonamentul.",
        line3: "După această dată vei trece automat pe planul FREE."
      },
      en: {
        title: "Subscription pending cancellation",
        line1: `You requested to cancel your ${user.plan.toUpperCase()} subscription.`,
        line2: "Your subscription will remain active until the end of the current billing period, which is one month from the date you requested cancellation.",
        line3: "After this date you will automatically switch to the FREE plan."
      }
    },
    cancelled: {
      ro: {
        title: "Abonament anulat",
        line1: "Acum ești pe planul FREE."
      },
      en: {
        title: "Subscription cancelled",
        line1: "You are now on the FREE plan."
      }
    }
  };



  // 1. Pending cancel
  if (user.status === "pending_cancel") {
  console.log("INTRU IN PENDING_CANCEL");

  let dateText = "";
  if (user.cancelAt) {
    dateText = new Date(user.cancelAt).toLocaleDateString(
      lang === "ro" ? "ro-RO" : "en-GB",
      { year: "numeric", month: "long", day: "numeric" }
    );
  }

  pendingBox.querySelector("h3").textContent = messages.pending[lang].title;
  const p = pendingBox.querySelectorAll("p");

  p[0].textContent = messages.pending[lang].line1;

  p[1].innerHTML = user.cancelAt
    ? `${messages.pending[lang].line2} <span id="cancel-date">${dateText}</span>.`
    : messages.pending[lang].line2;

  p[2].textContent = messages.pending[lang].line3;

  pendingBox.style.display = "block";
  container.classList.remove("hidden");
  return;
  }



  // 2. Cancelled
  if (user.status === "cancelled") {
    cancelledBox.querySelector("h3").textContent = messages.cancelled[lang].title;
    cancelledBox.querySelector("p").textContent = messages.cancelled[lang].line1;

    cancelledBox.style.display = "block";
    container.classList.remove("hidden");
    return;
  }
console.log("PENDING BOX:", pendingBox);
console.log("CANCELLED BOX:", cancelledBox);
console.log("CONTAINER:", container);

  // 3. Active → ascundem tot
  container.classList.add("hidden");
}


async function deleteAccount() {
  const email = window._meData.email; // 🔥 asta e cheia

  console.log("EMAIL TRIMIS:", email);

  const res = await fetch("/auth/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  if (data.success) {
    alert("Your account has been deleted successfully.");
    window.location.reload();
  } else {
    alert("Error occurred while deleting the account.");
  }

  if (window._meData.plan !== "free") {
  alert("You cannot delete your account while you have an active subscription. Please cancel your subscription first.");
  return;
  }

}


document.addEventListener("DOMContentLoaded", () => {
document.getElementById("btnLogin").addEventListener("click", loadDashboard);
document.getElementById("btnBasic").addEventListener("click", () => upgrade("basic"));
document.getElementById("btnPremium").addEventListener("click", () => upgrade("premium"));
document.getElementById("btnPortal").addEventListener("click", openPortal);
document.getElementById("btnDelete").addEventListener("click", deleteAccount);
});




// lanuage toggle and translations
const langToggle = document.getElementById("langToggle");
let currentLang = "en";

const savedLang = localStorage.getItem("lang");
if (savedLang === "ro" || savedLang === "en") {
  currentLang = savedLang;
}


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
    btnDelete: "Delete my account and all data",

    emailPlaceholder: "Enter your email",

    paragraph: "<strong>API Performance Notice</strong><br> This service currently runs on Render's free tier. The first request after a period of inactivity may experience a delay of up to 60 seconds while the instance wakes up. Once active, all responses are delivered instantly. We are working on optimizations and future improvements to enhance the overall experience."
  },

  ro: {
    navTitle: "API - Panou de control",
    authTitle: "Autentificare",
    introText: "Această pagină îți oferă acces la panoul tău personal de administrare al API‑ului. Autentificarea este necesară pentru a vizualiza planul activ, cheia API, limitele de utilizare și opțiunile de upgrade. Dashboard-ul îți permite să îți gestionezi abonamentul în siguranță și să urmărești în timp real modul în care folosești resursele API-ului.",

    accountInfoTitle: "Informații Cont",
    usageTitle: "Utilizare API",
    subscriptionTitle: "Administrare Abonament",

    labelEmail: "Email:",
    labelPlan: "Plan:",
    labelKey: "Cheie API:",
    labelReqToday: "Request-uri azi:",
    labelLimit: "Limită zilnică:",
    labelRemaining: "Request-uri rămase:",

    btnLogin: "Intră în Panoul de control",
    btnBasic: "Actualizează planul BASIC",
    btnPremium: "Actualizează planul PREMIUM",
    btnPortal: "Administrează abonamentul",
    btnDelete: "Șterge contul meu și toate datele", 
    emailPlaceholder: "Introdu emailul",

    paragraph: "<strong>Notă privind performanța API-ului</strong><br> Acest serviciu rulează în prezent pe un plan gratuit Render. Prima cerere după o perioadă de inactivitate poate avea o întârziere de aproximativ 60 de secunde, deoarece instanța este repornită automat.După activare, toate răspunsurile sunt livrate instant. Lucrăm la optimizări și viitoare actualizări pentru a îmbunătăți experiența de utilizare."
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
  document.getElementById("btnDelete").innerText = translations[lang].btnDelete;
  document.getElementById("email").placeholder = translations[lang].emailPlaceholder;
  document.getElementById("paragraph").innerHTML = translations[lang].paragraph;

}

langToggle.innerText = currentLang === "en" ? "RO" : "EN";
applyTranslations(currentLang);

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ro" : "en";
  langToggle.innerText = currentLang === "en" ? "RO" : "EN";
  localStorage.setItem("lang", currentLang);
  
  applyTranslations(currentLang);

  if (window._meData) {
  renderCancellationNotice(window._meData);
  }
});


// change year in footer
document.getElementById("year").textContent = new Date().getFullYear()
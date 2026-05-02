// checkout.js
// FREE registration
async function registerFree() {
  const email = document.getElementById("email").value;
  if (!email) return alert("Please enter your email address.");

  const response = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await response.json();
  if (data.apiKey) alert("Account created successfully! The FREE plan is activated.");
  else alert("Error: " + JSON.stringify(data));
}

// Stripe checkout
async function buy(plan) {
  const email = document.getElementById("email").value;
  if (!email) return alert("Please enter your email address.");

  const response = await fetch("/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, plan })
  });

  const data = await response.json();
  if (data.url) window.location.href = data.url;
  else alert("Error: " + JSON.stringify(data));
}


document.addEventListener("DOMContentLoaded", () => {
document.getElementById("btnFree").addEventListener("click", registerFree);
document.getElementById("btnBasic").addEventListener("click", () => buy("basic"));
document.getElementById("btnPremium").addEventListener("click", () => buy("premium"));
});

  
// /js/lang.js
// Language toggle and translations
const translations = {
  ro: {
    navTitle: "Planuri de Abonament",
    auth_title: "Autentificare / Înregistrare",
    email_placeholder: "Introduceți adresa de email",

    intro_title: "Acces la API-ul Poezii și Proza",
    intro_text:
      "Această pagină îți permite să îți creezi un cont, să activezi planul gratuit sau să alegi un abonament premium pentru acces extins la colecția noastră digitală de literatură clasică românească.",

    free_title: "FREE",
    free_price: "£0 / lună",
    free_desc: "• Acces limitat<br>• 100 request-uri / zi<br>• Fără acces la endpoint-uri premium",
    free_btn: "Activează GRATUIT",

    basic_title: "BASIC",
    basic_price: "£7 / lună",
    basic_desc: "• 10.000 request-uri / lună<br>• Acces la endpoint-uri standard<br>• Suport prin email",
    basic_btn: "Cumpără BASIC",

    premium_title: "PREMIUM",
    premium_price: "£15 / lună",
    premium_desc: "• 50.000 request-uri / lună<br>• Acces complet la API<br>• Prioritate suport<br>• Funcții exclusive",
    premium_btn: "Cumpără PREMIUM",

    paragraph: "<strong>Notă privind performanța API-ului</strong><br> Acest serviciu rulează în prezent pe un plan gratuit Render. Prima cerere după o perioadă de inactivitate poate avea o întârziere de aproximativ 60 de secunde, deoarece instanța este repornită automat.După activare, toate răspunsurile sunt livrate instant. Lucrăm la optimizări și viitoare actualizări pentru a îmbunătăți experiența de utilizare."
  },

  en: {
    navTitle: "Subscription Plans",
    auth_title: "Login / Register",
    email_placeholder: "Enter your email address",

    intro_title: "Access to the Poems & Prose API",
    intro_text:
      "This page allows you to create an account, activate the free plan, or choose a premium subscription for extended access to our digital collection of Romanian classical literature.",

    free_title: "FREE",
    free_price: "£0 / month",
    free_desc: "• Limited access<br>• 100 requests / day<br>• No access to premium endpoints",
    free_btn: "Activate FREE",

    basic_title: "BASIC",
    basic_price: "£7 / month",
    basic_desc: "• 10,000 requests / month<br>• Access to standard endpoints<br>• Email support",
    basic_btn: "Buy BASIC",

    premium_title: "PREMIUM",
    premium_price: "£15 / month",
    premium_desc: "• 50,000 requests / month<br>• Full API access<br>• Priority support<br>• Exclusive features",
    premium_btn: "Buy PREMIUM",

    paragraph: "<strong>API Performance Notice</strong><br> This service currently runs on Render's free tier. The first request after a period of inactivity may experience a delay of up to 60 seconds while the instance wakes up. Once active, all responses are delivered instantly. We are working on optimizations and future improvements to enhance the overall experience."
  }
};

let currentLang = "en";

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = translations[currentLang][key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = translations[currentLang][key];
  });

  document.getElementById("paragraph").innerHTML = translations[currentLang].paragraph;
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();

  const toggleBtn = document.getElementById("langToggle");
  toggleBtn.addEventListener("click", () => {
    currentLang = currentLang === "ro" ? "en" : "ro";
    toggleBtn.textContent = currentLang === "ro" ? "EN" : "RO";
    applyTranslations();
  });
});


// change year in footer
document.getElementById("year").textContent = new Date().getFullYear()

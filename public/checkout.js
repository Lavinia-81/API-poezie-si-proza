 
    // FREE registration
    async function registerFree() {
      const email = document.getElementById("email").value;
      if (!email) return alert("Introduceți emailul înainte de a continua.");

      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (data.apiKey) alert("Cont creat cu succes! Planul FREE este activ.");
      else alert("Eroare: " + JSON.stringify(data));
    }

    // Stripe checkout
    async function buy(plan) {
      const email = document.getElementById("email").value;
      if (!email) return alert("Introduceți emailul înainte de a continua.");

      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan })
      });

      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else alert("Eroare: " + JSON.stringify(data));
    }
  


  
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
    free_price: "0 lei / lună",
    free_desc: "• Acces limitat<br>• 50 request-uri / zi<br>• Fără acces la endpoint-uri premium",
    free_btn: "Activează GRATUIT",

    basic_title: "BASIC",
    basic_price: "19 lei / lună",
    basic_desc: "• 5.000 request-uri / lună<br>• Acces la endpoint-uri standard<br>• Suport prin email",
    basic_btn: "Cumpără BASIC",

    premium_title: "PREMIUM",
    premium_price: "49 lei / lună",
    premium_desc: "• 50.000 request-uri / lună<br>• Acces complet la API<br>• Prioritate suport<br>• Funcții exclusive",
    premium_btn: "Cumpără PREMIUM"
  },

  en: {
    navTitle: "Subscription Plans",
    auth_title: "Login / Register",
    email_placeholder: "Enter your email address",

    intro_title: "Access to the Poems & Prose API",
    intro_text:
      "This page allows you to create an account, activate the free plan, or choose a premium subscription for extended access to our digital collection of Romanian classical literature.",

    free_title: "FREE",
    free_price: "0 lei / month",
    free_desc: "• Limited access<br>• 50 requests / day<br>• No access to premium endpoints",
    free_btn: "Activate FREE",

    basic_title: "BASIC",
    basic_price: "19 lei / month",
    basic_desc: "• 5,000 requests / month<br>• Access to standard endpoints<br>• Email support",
    basic_btn: "Buy BASIC",

    premium_title: "PREMIUM",
    premium_price: "49 lei / month",
    premium_desc: "• 50,000 requests / month<br>• Full API access<br>• Priority support<br>• Exclusive features",
    premium_btn: "Buy PREMIUM"
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

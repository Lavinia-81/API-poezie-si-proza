let currentLang = "en";

const translations = {
  ro: {
    title: "Plata a fost finalizată cu succes",
    text: "Abonamentul tău este acum activ. Poți reveni la pagina de planuri sau poți accesa dashboard-ul pentru a vedea detaliile abonamentului.",
    btnPlans: "Înapoi la planuri",
    btnDashboard: "Mergi la Dashboard",
    toggle: "EN"
  },
  en: {
    title: "Payment completed successfully",
    text: "Your subscription is now active. You can return to the plans page or access your dashboard to view your subscription details.",
    btnPlans: "Back to Plans",
    btnDashboard: "Go to Dashboard",
    toggle: "RO"
  }
};

function applyTranslations() {
  document.getElementById("title").innerText = translations[currentLang].title;
  document.getElementById("text").innerText = translations[currentLang].text;
  document.getElementById("btnPlans").innerText = translations[currentLang].btnPlans;
  document.getElementById("btnDashboard").innerText = translations[currentLang].btnDashboard;
  document.getElementById("langToggle").innerText = translations[currentLang].toggle;
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();

  document.getElementById("langToggle").addEventListener("click", () => {
    currentLang = currentLang === "ro" ? "en" : "ro";
    applyTranslations();
  });
});

success_url: `${process.env.FRONTEND_URL}/success.html`

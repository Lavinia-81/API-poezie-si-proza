const langToggle = document.getElementById("langToggle");
let currentLang = "en";

const translations = {
  ro: {
    navTitle: "Prezentare API",

    introTitle: "De ce documentația completă este restricționată",
    introText:
      "Pentru a proteja API-ul Poezii și Proză de scraping, clonare automată și extragere neautorizată a datelor literare structurate, documentația tehnică completă este disponibilă doar utilizatorilor autentificați. Fiecare plan de acces deblochează un nivel diferit de documentație: Utilizatorii gratuiti primesc această pagină de prezentare, care explică structura API-ului și endpointurile disponibile. Utilizatorii basic au acces la documentația completă Redoc. Utilizatorii premium au acces atât la Redoc, cât și la Swagger, inclusiv la instrumente de testare live.",

    plansTitle: "Planurile API",

    freeTitle: "Plan Gratuit",
    freeText:
      "Acces la endpointurile esențiale cu limite generoase. Acest plan include această pagină de prezentare, care explică cum funcționează API-ul și cum se apelă endpointurile principale. Documentația completă (Redoc/Swagger) nu este inclusă. Potrivit pentru testare, învățare și proiecte personale mici.",

    basicTitle: "Plan Basic",
    basicText:
      "Include acces la toate endpointurile de bază și documentația completă Redoc. Redoc oferă documentație structurată și ușor de citit cu scheme, exemple și descrieri ale endpointurilor. Swagger nu este inclus în acest plan. Recomandat pentru dezvoltatori care doresc o documentație clară fără funcții de testare interactivă.",

    premiumTitle: "Plan Premium",
    premiumText:
      "Acces complet la toate endpointurile, căutare avansată, metadate și ambele sisteme de documentație: Redoc (documentație completă și structurată) și Swagger (testare interactivă, cereri live, introspecție de scheme). Recomandat pentru aplicații de producție, platforme de cercetare și instituții culturale.",

    endpointsTitle: "Ce endpointuri există?",
    endpointsText:
      "API-ul oferă acces structurat la literatura românească din domeniul public. Fără a expune detalii tehnice, iată o prezentare generală:",

    ep1: "Autori – lista autorilor disponibili și metadate",
    ep2: "Poezii – acces la poezii din domeniul public",
    ep3: "Proză – acces la texte clasice în proză",
    ep4: "Căutare – căutare după cuvinte‑cheie în arhivă",

    accessTitle: "Cum obții acces la documentația completă",
    accessText:
      "După alegerea unui plan, dashboard-ul tău va debloca automat documentația disponibilă pentru nivelul tău: Free → doar prezentare Basic → Redoc Premium → Redoc + Swagger Aceste pagini rămân protejate pentru a asigura integritatea și securitatea pe termen lung a API-ului."
  },

  en: {
    navTitle: "API Overview",

    introTitle: "Why Some Documentation Is Restricted",
    introText:
      "To protect the Poems & Prose API from scraping, automated cloning, and unauthorized extraction of structured literary data, full technical documentation is available only to authenticated users.Each plan unlocks a different level of documentation:Free users receive this Overview page, which explains the API structure and available endpoints.Basic users gain access to the full Redoc documentation.Premium users gain access to both Redoc and Swagger, including live testing tools.",

    plansTitle: "API Access Plans",

    freeTitle: "Free Plan",
    freeText:
      "Access to essential endpoints with generous daily limits. This plan includes this Overview page, which explains how the API works and how to call the main endpoints. Full documentation (Redoc/Swagger) is not included. Suitable for testing, learning, and small personal projects.",

    basicTitle: "Basic Plan",
    basicText:
      "Includes access to all core endpoints and full Redoc documentation. Redoc provides structured, human‑readable documentation with schemas, examples, and endpoint descriptions. Swagger is not included in this plan. Recommended for developers who want clear documentation without interactive testing features.",

    premiumTitle: "Premium Plan",
    premiumText:
      "Full access to all endpoints, advanced search, metadata, and both documentation systems: Redoc (complete structured documentation) and Swagger (interactive testing, live requests, schema introspection).Recommended for production applications, research platforms, and cultural institutions.",

    endpointsTitle: "What Endpoints Exist?",
    endpointsText:
      " The API provides structured access to public‑domain Romanian literature. Free users can call the main endpoints directly using their API key, while Basic and Premium users can explore full documentation through Redoc or Swagger.",

    ep1: "Authors – retrieve available authors and metadata",
    ep2: "Poems – access poetry from public‑domain authors",
    ep3: "Prose – retrieve classical prose texts",
    ep4: "Search – keyword‑based search across the archive",

    accessTitle: "How to Access Full Documentation",
    accessText:
      "After choosing a plan, your dashboard will automatically unlock the documentation available for your tier:Free → Overview only Basic → Redoc Premium → Redoc + Swagger These pages remain protected to ensure the long‑term integrity and security of the API."
  }
};

function applyTranslations(lang) {
  for (const key in translations[lang]) {
    const el = document.getElementById(key);
    if (el) el.innerHTML = translations[lang][key];
  }
}

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "ro" ? "en" : "ro";
  langToggle.innerText = currentLang === "ro" ? "EN" : "RO";
  applyTranslations(currentLang);
});

document.getElementById("year").textContent = new Date().getFullYear();


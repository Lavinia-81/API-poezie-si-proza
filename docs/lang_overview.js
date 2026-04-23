const langToggle = document.getElementById("langToggle");
let currentLang = "en";

const translations = {
  ro: {
    navTitle: "Prezentare API",

    introTitle: "De ce documentația completă este restricționată",
    introText:
      "Pentru a proteja API-ul Poems & Prose de clonare, scraping și extragere automată neautorizată, documentația tehnică completă (Redoc & Swagger) nu este accesibilă public. Doar utilizatorii autentificați cu un plan valid pot vedea detalii sensibile precum structura requesturilor, schema răspunsurilor, limitele și endpointurile avansate.",

    plansTitle: "Planurile API",

    freeTitle: "Plan Gratuit",
    freeText:
      "Acces limitat la endpointurile esențiale. Potrivit pentru testare, învățare și proiecte personale mici. Nu include acces la documentația completă sau funcțiile avansate de căutare.",

    basicTitle: "Plan Basic",
    basicText:
      "Include acces la endpointurile de bază cu limite moderate. Utilizatorii pot vedea documentație parțială și exemple structurate pentru integrare.",

    premiumTitle: "Plan Premium",
    premiumText:
      "Acces complet la toate endpointurile, căutare avansată, metadate și documentația completă Redoc/Swagger. Recomandat pentru aplicații de producție, platforme de cercetare și instituții culturale.",

    endpointsTitle: "Ce endpointuri există?",
    endpointsText:
      "API-ul oferă acces structurat la literatura românească din domeniul public. Fără a expune detalii tehnice, iată o prezentare generală:",

    ep1: "Autori – lista autorilor disponibili și metadate",
    ep2: "Poezii – acces la poezii din domeniul public",
    ep3: "Proză – acces la texte clasice în proză",
    ep4: "Căutare – căutare după cuvinte‑cheie în arhivă",

    accessTitle: "Cum obții acces la documentația completă",
    accessText:
      "După alegerea unui plan, vei primi un link securizat către paginile Redoc și Swagger, împreună cu cheia ta API și instrucțiuni de utilizare. Aceste pagini rămân ascunse publicului pentru a proteja API-ul."
  },

  en: {
    navTitle: "API Overview",

    introTitle: "Why Some Documentation Is Restricted",
    introText:
      "To protect the Poems & Prose API from cloning, scraping, and unauthorized automated extraction, the full technical documentation (Redoc & Swagger) is not publicly accessible. Only authenticated users with a valid plan can view sensitive details such as request structures, response schemas, rate limits, and advanced endpoints.",

    plansTitle: "API Access Plans",

    freeTitle: "Free Plan",
    freeText:
      "Limited access to essential endpoints. Suitable for testing, learning, and small personal projects. Does not include access to full documentation or advanced search features.",

    basicTitle: "Basic Plan",
    basicText:
      "Includes access to core endpoints with moderate rate limits. Users can view partial documentation and receive structured examples for integration.",

    premiumTitle: "Premium Plan",
    premiumText:
      "Full access to all endpoints, advanced search, metadata, and complete Redoc/Swagger documentation. Recommended for production applications, research platforms, and cultural institutions.",

    endpointsTitle: "What Endpoints Exist?",
    endpointsText:
      "The API provides structured access to public‑domain Romanian literature. Here is a general overview without exposing sensitive details:",

    ep1: "Authors – retrieve available authors and metadata",
    ep2: "Poems – access poetry from public‑domain authors",
    ep3: "Prose – retrieve classical prose texts",
    ep4: "Search – keyword‑based search across the archive",

    accessTitle: "How to Access Full Documentation",
    accessText:
      "After choosing a plan, you will receive a secure link to the full Redoc and Swagger pages, along with your API key and usage instructions. These pages remain hidden from the public to ensure long‑term safety."
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


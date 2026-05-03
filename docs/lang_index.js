// lanuage toggle and translations
  const langToggle = document.getElementById("langToggle");
  let currentLang = "en"; // Default language

  const translations = {
    ro: {
    navTitle: "API - Poezii și Proză",
    title: "Poezii și Proză - Literatura Clasică Românească - API",
    subtitle: "O arhivă digitală rafinată a patrimoniului literar românesc, concepută pentru dezvoltatori, cercetători și instituții culturale.",
    aboutTitle: "Despre Proiect",

    about1: "API-ul Poezii și Proză este o arhivă digitală dedicată literaturii clasice românești.  A fost conceput ca o resursă culturală pe termen lung, oferind acces structurat la poezie, proză, metadate despre autori și elemente biografice care sunt adesea greu de găsit într-un format coerent și prietenos pentru dezvoltatori.",

    about2: "Deși patrimoniul literar românesc cuprinde peste 300 de autori canonici , nu toți pot fi integrați în acest API. Multe opere literare sunt încă protejate de drepturi de autor și, prin urmare, nu pot fi distribuite sau expuse printr-o interfață publică. Autorii și textele incluse aici aparțindomeniului public ceea ce permite conservarea, indexarea și reutilizarea lor educațională într-un mod legal și responsabil.",

    about3: "API-ul este conceput ca un sistem doar pentru citire. Scopul său nu este de a modifica sau reinterpreta conținutul cultural, ci de a-l conserva și de a-l face accesibil pentru:",

    list1: "platforme educaționale și inițiative digitale dedicate studiilor umaniste",
    list2: "cercetători și studenți ai literaturii române",
    list3: "dezvoltatori care construiesc aplicații culturale sau lingvistice",
    list4: "inițiative arhivistice, bibliografice și de conservare a patrimoniului",

      about4: "Dincolo de structura sa tehnică, acest proiect reprezintă o contribuție personală la conservarea digitală a patrimoniului literar românesc. Scopul său este de a aduce textele clasice în ecosisteme moderne, unde pot fi explorate, indexate, vizualizate și integrate în noi instrumente creative sau academice.",
    
    paragraph: "<strong>Notă privind performanța API-ului</strong><br> Acest serviciu rulează în prezent pe un plan gratuit Render. Prima cerere după o perioadă de inactivitate poate avea o întârziere de aproximativ 60 de secunde, deoarece instanța este repornită automat.După activare, toate răspunsurile sunt livrate instant. Lucrăm la optimizări și viitoare actualizări pentru a îmbunătăți experiența de utilizare." 
    
  },

    en: {
    navTitle: "Poems and Prose - API",
    title: "Poems and Prose - Romanian Classical Literature API",
    subtitle: " A refined digital archive of Romanian literary heritage, designed for developers, researchers, and cultural institutions.",
    aboutTitle: "About the Project",

    about1: "The Poems and Prose API is a digital archive dedicated to Romanian classical literature. It was designed as a long-term cultural resource, offering structured access to poetry, prose, author metadata, and biographicalelements that are often difficult to find in a consistent, developer-friendly format.",

    about2: " Although the Romanian literary heritage includes over 300 classical authors, not all can be featured in this API. Many literary works remain protected by copyright, and therefore cannot be distributed or exposed through a public interface. The authors and texts included here belong to the public domain, which allows their preservation, indexing, and educational reuse in a legally compliant way. If a poet or a specific work does not appear in the collection, this is the reason.",

    about3: "The API is read-only by design. Its purpose is not to modify or reinterpret cultural content, but to preserve it and make it accessible for:",

    list1: "educational platforms and digital humanities projects",
    list2: "researchers and students of Romanian literature",
    list3: "developers building cultural or linguistic applications",
    list4: "archival, bibliographic, and heritage-preservation initiatives",

    about4: "Beyond its technical structure, this project is a personal contribution to the digital preservation of Romanian literary heritage. It aims to bring classical texts into modern ecosystems, where they can be explored, indexed, visualized, and integrated into new creative or academic tools.",

    paragraph: "<strong>API Performance Notice</strong><br> This service currently runs on Render's free tier. The first request after a period of inactivity may experience a delay of up to 60 seconds while the instance wakes up. Once active, all responses are delivered instantly. We are working on optimizations and future improvements to enhance the overall experience."
    }
};
    
function applyTranslations(lang) {
    
  document.getElementById("mainTitle").innerText = translations[lang].title;
  document.getElementById("subtitle").innerText = translations[lang].subtitle;
  document.getElementById("navTitle").innerText = translations[lang].navTitle;

  document.getElementById("aboutTitle").innerText = translations[lang].aboutTitle;
  document.getElementById("about1").innerText = translations[lang].about1;
  document.getElementById("about2").innerText = translations[lang].about2;
  document.getElementById("about3").innerText = translations[lang].about3;
  document.getElementById("about4").innerText = translations[lang].about4;

  document.getElementById("list1").innerText = translations[lang].list1;
  document.getElementById("list2").innerText = translations[lang].list2;
  document.getElementById("list3").innerText = translations[lang].list3;
  document.getElementById("list4").innerText = translations[lang].list4;
  document.getElementById("paragraph").innerHTML = translations[lang].paragraph;
}

// Initialize with default language
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ro" ? "en" : "ro";
    langToggle.innerText = currentLang === "ro" ? "EN" : "RO";
    applyTranslations(currentLang);
  });

  
// change year in footer
  document.getElementById("year").textContent = new Date().getFullYear()
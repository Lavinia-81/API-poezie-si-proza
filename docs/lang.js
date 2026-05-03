document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  if (!langToggle) return;

  const roSection = document.getElementById('ro');
  const enSection = document.getElementById('en');

  // LIMBA IMPLICITĂ: ENGLEZA
  let currentLang = 'en';

  function applyLanguage(lang) {
    if (!roSection || !enSection) return;

    if (lang === 'en') {
      enSection.style.display = 'block';
      roSection.style.display = 'none';
      langToggle.textContent = 'RO'; // afișăm limba alternativă
    } else {
      enSection.style.display = 'none';
      roSection.style.display = 'block';
      langToggle.textContent = 'EN';
    }
  }

  // aplicăm limba implicită la încărcare
  applyLanguage(currentLang);

  // toggle la click
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ro' : 'en';
    applyLanguage(currentLang);
  });
});

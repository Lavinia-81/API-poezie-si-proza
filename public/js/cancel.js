// cancel.js
document.addEventListener("DOMContentLoaded", () => {
      const messages = {
        en: {
          title: "Payment Cancelled",
          text: "No transaction was completed. You can try again anytime.",
          button: "Back to homepage",
          toggle: "RO"
        },
        ro: {
          title: "Plata a fost anulată",
          text: "Nu s-a efectuat nicio tranzacție. Poți încerca din nou oricând dorești.",
          button: "Înapoi la pagina principală",
          toggle: "EN"
        }
      };

      let lang = localStorage.getItem("lang") || "en";

      function render() {
        document.getElementById("title").textContent = messages[lang].title;
        document.getElementById("text").textContent = messages[lang].text;
        document.getElementById("button").textContent = messages[lang].button;
        document.getElementById("langToggle").textContent = messages[lang].toggle;
        document.documentElement.lang = lang;
      }

      document.getElementById("langToggle").addEventListener("click", () => {
        console.log("LANG TOGGLE CLICKED");
        lang = lang === "en" ? "ro" : "en";
        localStorage.setItem("lang", lang);
        render();
      });

      render();
    });
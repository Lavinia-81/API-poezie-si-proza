async function loadNavbar() {
  const apiKey = localStorage.getItem("apiKey");

  // dacă nu există API key → user FREE
  if (!apiKey) {
    showLinksForPlan("free");
    return;
  }

  try {
    const res = await fetch("/auth/me", {
      headers: { "x-api-key": apiKey }
    });

    if (!res.ok) {
      showLinksForPlan("free");
      return;
    }

    const user = await res.json();
    showLinksForPlan(user.plan);
  } catch (err) {
    showLinksForPlan("free");
  }
}

function showLinksForPlan(plan) {
  const redoc = document.getElementById("nav-redoc");
  const swagger = document.getElementById("nav-swagger");

  // ascundem tot implicit
  redoc.style.display = "none";
  swagger.style.display = "none";

  // Redoc pentru toate planurile
  redoc.style.display = "inline-block";

  // Swagger doar pentru premium
  if (plan === "premium") {
    swagger.style.display = "inline-block";
  }
}

loadNavbar();

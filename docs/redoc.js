 // docs/redoc.js   
Redoc.init("/openapi.yaml", {
  theme: {
    colors: {
      primary: {
        main: "#6a1b1a" 
      },
      text: {
        primary: "#2b2b2b",
        secondary: "#5a5a5a"
      },
      http: {
        get: "#4caf50",
        post: "#1976d2",
        put: "#ffa000",
        delete: "#d32f2f"
      }
    },
    typography: {
      fontFamily: "Merriweather, serif",
      fontSize: "16px",
      headings: {
        fontFamily: "Merriweather, serif",
        fontWeight: "700"
      }
    },
    sidebar: {
      backgroundColor: "#f3ede6"
    }
  }
}, document.getElementById("redoc-container"));


document.getElementById("year").textContent = new Date().getFullYear()
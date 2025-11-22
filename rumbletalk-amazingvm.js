const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 10000;

// Root route
app.get("/", (req, res) => {
  res.send("Proxy is running. Use /rumbletalk-amazingvm");
});

// Proxy route
app.get("/rumbletalk-amazingvm", async (req, res) => {
  try {
    const targetUrl = "https://amazingvm.netlify.app/rumbletalk.html";

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "text/html"
      }
    });

    if (!response.ok) {
      return res.status(response.status).send("Upstream error");
    }

    let html = await response.text();

    // Remove mobile viewport meta
    html = html.replace(/<meta[^>]*name=["']viewport["'][^>]*>/gi, "");

    // Inject desktop-mode flag
    html = html.replace("</head>", `
      <script>
        // Force desktop mode flag
        window.isDesktopMode = true;
        document.documentElement.setAttribute("data-mode", "desktop");
      </script>
    </head>`);

    res.set("Content-Type", "text/html; charset=utf-8").send(html);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

// Root route just to confirm service is running
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

    // Remove any mobile viewport meta
    html = html.replace(/<meta[^>]*name=["']viewport["'][^>]*>/gi, "");

    // Inject desktop CSS overrides with scaling for mobile
    html = html.replace("</head>", `
      <style>
        /* Force desktop layout */
        html, body {
          min-width: 1024px !important;
        }
        /* Scale down desktop layout to fit mobile screens */
        body {
          transform: scale(0.35);   /* adjust this factor until it fits nicely */
          transform-origin: top left;
          width: 100% !important;
          overflow-x: hidden !important;
        }
        iframe {
          min-width: 1024px !important;
        }
      </style>
    </head>`);

    res.set("Content-Type", "text/html; charset=utf-8").send(html);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

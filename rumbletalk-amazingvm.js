const express = require("express");
const fetch = require("node-fetch");

const app = express();

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
    html = html.replace(/<meta[^>]*name=["']viewport["'][^>]*>/gi, "");

    res.set("Content-Type", "text/html; charset=utf-8").send(html);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running at http://localhost:${PORT}/rumbletalk-amazingvm`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase connection values come from the .env file.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// External API keys from .env.
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MAPS_API_KEY = process.env.MAPS_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Stop the server early if required Supabase keys are missing.
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Supabase environment variables missing.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
// Serve the frontend from the public folder.
app.use(express.static(path.join(__dirname, "../public")));

// Reusable API request flow to Supabase REST API.
async function fetchSupabase(table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  console.log(`Supabase request: ${url}`);

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

// Supabase routes.
app.get("/api/berita", async (req, res) => {
  try {
    const data = await fetchSupabase("berita");
    res.json(data);
  } catch (err) {
    console.error("Supabase error (/api/berita):", err);
    res.status(500).json({ error: "Database request failed" });
  }
});

app.get("/api/perangkat", async (req, res) => {
  try {
    const data = await fetchSupabase("perangkat_desa");
    res.json(data);
  } catch (err) {
    console.error("Supabase error (/api/perangkat):", err);
    res.status(500).json({ error: "Database request failed" });
  }
});

app.get("/api/galeri", async (req, res) => {
  try {
    const data = await fetchSupabase("galeri");
    res.json(data);
  } catch (err) {
    console.error("Supabase error (/api/galeri):", err);
    res.status(500).json({ error: "Database request failed" });
  }
});

app.get("/api/profil", async (req, res) => {
  try {
    const data = await fetchSupabase("profil_desa");
    res.json(data);
  } catch (err) {
    console.error("Supabase error (/api/profil):", err);
    res.status(500).json({ error: "Database request failed" });
  }
});

// External API: OpenWeather (default city is Jakarta, override with ?city=NamaKota)
app.get("/api/weather", async (req, res) => {
  try {
    if (!WEATHER_API_KEY) {
      throw new Error("WEATHER_API_KEY is missing");
    }

    const city = req.query.city || "Jakarta";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${WEATHER_API_KEY}&units=metric&lang=id`;

    console.log(`Weather request: ${url}`);
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    res.json(data);
  } catch (err) {
    console.error("Weather API error:", err);
    res.status(500).json({ error: "Weather request failed" });
  }
});

// External API: Google Maps embed URL (default query uses Desa Jamus)
app.get("/api/maps", (req, res) => {
  try {
    if (!MAPS_API_KEY) {
      throw new Error("MAPS_API_KEY is missing");
    }

    const query = req.query.q || "Desa Jamus";
    const url = `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${encodeURIComponent(
      query
    )}`;

    res.json({ url });
  } catch (err) {
    console.error("Maps API error:", err);
    res.status(500).json({ error: "Maps request failed" });
  }
});

// External API: News API (Indonesian headlines)
app.get("/api/news", async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      throw new Error("NEWS_API_KEY is missing");
    }

    const url = `https://newsapi.org/v2/top-headlines?country=id&apiKey=${NEWS_API_KEY}`;
    console.log(`News request: ${url}`);
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    res.json(data);
  } catch (err) {
    console.error("News API error:", err);
    res.status(500).json({ error: "News request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

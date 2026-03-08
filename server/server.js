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

// Stop the server early if the required keys are missing.
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Supabase environment variables missing.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
// Serve the frontend from the public folder.
app.use(express.static(path.join(__dirname, "../public")));

// Reusable API request flow: call Supabase, return data, and handle errors safely.
async function fetchSupabase(table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

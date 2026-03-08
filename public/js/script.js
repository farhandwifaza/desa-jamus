const API_BASE = "";
const DESA_COORDS = { lat: -7.8159, lon: 110.1335 };

// Small helper to get JSON from the backend.
async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function setError(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "<p class=\"text-danger\">Failed to load API data.</p>";
  }
}

function setApiStatus(ok) {
  const statusEl = document.getElementById("api-status");
  if (!statusEl) {
    return;
  }
  statusEl.className = ok ? "status-pill status-ok" : "status-pill status-bad";
  statusEl.textContent = ok ? "API Status: Connected" : "API Status: Failed";
}

// Render news cards on the Berita page.
function renderBerita(items) {
  const container = document.getElementById("berita-list");
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "<p class=\"text-muted\">Tidak ada data berita.</p>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.judul || item.title || "Judul belum tersedia";
      const date = item.tanggal || item.date || "Tanggal belum tersedia";
      const body = item.isi || item.content || "Konten belum tersedia";
      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 card-soft">
            <div class="card-body">
              <span class="badge badge-soft">Supabase</span>
              <h5 class="card-title mt-2">${title}</h5>
              <p class="text-muted small mb-2">${date}</p>
              <p class="card-text">${body}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// Render staff cards on the Perangkat page.
function renderPerangkat(items) {
  const container = document.getElementById("perangkat-list");
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "<p class=\"text-muted\">Tidak ada data perangkat.</p>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const name = item.nama || item.name || "Nama belum tersedia";
      const role = item.jabatan || item.role || "Jabatan belum tersedia";
      const info = item.deskripsi || item.description || "Informasi belum tersedia";
      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 card-soft">
            <div class="card-body">
              <span class="badge badge-soft">Supabase</span>
              <h5 class="card-title mt-2">${name}</h5>
              <p class="text-muted">${role}</p>
              <p class="card-text">${info}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// Render gallery cards on the Galeri page.
function renderGaleri(items) {
  const container = document.getElementById("galeri-list");
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "<p class=\"text-muted\">Tidak ada data galeri.</p>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.judul || item.title || "Judul belum tersedia";
      const desc = item.deskripsi || item.description || "Deskripsi belum tersedia";
      const image = item.gambar_url || item.image_url || "";
      const imageBlock = image
        ? `<img src="${image}" class="card-img-top" alt="${title}" />`
        : `<div class="card-img-top placeholder-box"></div>`;

      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 card-soft">
            ${imageBlock}
            <div class="card-body">
              <span class="badge badge-soft">Supabase</span>
              <h5 class="card-title mt-2">${title}</h5>
              <p class="card-text">${desc}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// Render profile cards on the Profil page.
function renderProfil(items) {
  const container = document.getElementById("profil-list");
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "<p class=\"text-muted\">Tidak ada data profil.</p>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.judul || item.title || "Judul belum tersedia";
      const body = item.isi || item.content || "Konten belum tersedia";
      return `
        <div class="col-lg-6">
          <div class="card h-100 card-soft">
            <div class="card-body">
              <span class="badge badge-soft">Supabase</span>
              <h5 class="card-title mt-2">${title}</h5>
              <p class="card-text">${body}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderWeather(data) {
  const container = document.getElementById("weather-card");
  if (!container) {
    return;
  }

  if (!data || !data.main || !data.weather || !data.weather[0]) {
    container.innerHTML = "<p class=\"text-muted\">Data cuaca belum tersedia.</p>";
    return;
  }

  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description || "";
  const humidity = data.main.humidity;
  const wind = data.wind?.speed ?? "-";

  container.innerHTML = `
    <div class="card h-100 card-soft">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">${temp}&deg;C</h5>
          <span class="badge badge-soft">OpenWeather</span>
        </div>
        <p class="text-muted mt-2">${description}</p>
        <div class="weather-grid">
          <div>
            <span class="label">Kelembapan</span>
            <span class="value">${humidity}%</span>
          </div>
          <div>
            <span class="label">Angin</span>
            <span class="value">${wind} m/s</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function loadMap() {
  const container = document.getElementById("map-container");
  if (!container) {
    return;
  }

  const { lat, lon } = DESA_COORDS;
  const bbox = `${lon - 0.02},${lat - 0.02},${lon + 0.02},${lat + 0.02}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  container.innerHTML = `
    <iframe
      class="map-frame"
      title="Peta Lokasi Desa Jamus"
      src="${src}"
      loading="lazy"
    ></iframe>
  `;
}

async function loadWeather() {
  const container = document.getElementById("weather-card");
  if (!container) {
    return;
  }

  const apiKey = window.WEATHER_API_KEY;
  if (!apiKey) {
    container.innerHTML = "<p class=\"text-danger\">WEATHER_API_KEY belum diisi.</p>";
    return;
  }

  try {
    const { lat, lon } = DESA_COORDS;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Weather request failed");
    }

    renderWeather(data);
  } catch (error) {
    console.error("Weather API error:", error);
    container.innerHTML = "<p class=\"text-danger\">Failed to load API data.</p>";
  }
}

function startClock() {
  const timeEl = document.getElementById("clock-time");
  const dateEl = document.getElementById("clock-date");
  if (!timeEl || !dateEl) {
    return;
  }

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const tick = () => {
    const now = new Date();
    timeEl.textContent = timeFormatter.format(now);
    dateEl.textContent = dateFormatter.format(now);
  };

  tick();
  setInterval(tick, 1000);
}

// Load news data from the backend and render cards.
async function loadBerita() {
  try {
    const data = await fetchJson("/api/berita");
    console.log("API response:", data);
    renderBerita(data);
  } catch (error) {
    console.error("API error:", error);
    setError("berita-list");
  }
}

// Load staff data from the backend and render cards.
async function loadPerangkat() {
  try {
    const data = await fetchJson("/api/perangkat");
    console.log("API response:", data);
    renderPerangkat(data);
    setApiStatus(true);
  } catch (error) {
    console.error("API error:", error);
    setError("perangkat-list");
    setApiStatus(false);
  }
}

// Load gallery data from the backend and render cards.
async function loadGaleri() {
  try {
    const data = await fetchJson("/api/galeri");
    console.log("API response:", data);
    renderGaleri(data);
  } catch (error) {
    console.error("API error:", error);
    setError("galeri-list");
  }
}

// Load profile data from the backend and render cards.
async function loadProfil() {
  try {
    const data = await fetchJson("/api/profil");
    console.log("API response:", data);
    renderProfil(data);
  } catch (error) {
    console.error("API error:", error);
    setError("profil-list");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadBerita();
  loadPerangkat();
  loadGaleri();
  loadProfil();
  loadMap();
  loadWeather();
  startClock();
});

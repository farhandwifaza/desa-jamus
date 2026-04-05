const API_BASE = "";
const DESA_COORDS = { lat: -7.8159, lon: 110.1335 };

// Small helper to get JSON from the backend.
async function fetchJson(endpoint) {
  console.log("Fetching:", endpoint);
  const response = await fetch(`${API_BASE}${endpoint}`);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed: ${response.status}`);
  }
  return data;
}

function setListState(containerId, html) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="col-12">${html}</div>`;
  }
}

function setBlockState(containerId, html) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = html;
  }
}

function setListLoading(containerId, message = "Memuat data...") {
  setListState(containerId, `<div class="loading-state">${message}</div>`);
}

function setListError(containerId, message = "Gagal memuat data. Silakan coba lagi.") {
  setListState(containerId, `<div class="error-state">${message}</div>`);
}

function setBlockLoading(containerId, message = "Memuat data...") {
  setBlockState(containerId, `<div class="loading-state">${message}</div>`);
}

function setBlockError(containerId, message = "Gagal memuat data. Silakan coba lagi.") {
  setBlockState(containerId, `<div class="error-state">${message}</div>`);
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
function renderBerita(items, containerId = "berita-list") {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    setListState(containerId, "<div class=\"text-muted\">Tidak ada data berita.</div>");
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.judul || item.title || "Judul belum tersedia";
      const date = item.tanggal || item.date || "Tanggal belum tersedia";
      const body = item.isi || item.content || "Konten belum tersedia";
      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 card-soft hover-lift">
            <div class="card-body">
              <span class="badge badge-label">Supabase</span>
              <h5 class="card-title mt-3">${title}</h5>
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
    setListState("perangkat-list", "<div class=\"text-muted\">Tidak ada data perangkat.</div>");
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const name = item.nama || item.name || "Nama belum tersedia";
      const role = item.jabatan || item.role || "Jabatan belum tersedia";
      const info = item.deskripsi || item.description || "Informasi belum tersedia";
      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 card-soft hover-lift">
            <div class="card-body">
              <span class="badge badge-label">Supabase</span>
              <h5 class="card-title mt-3">${name}</h5>
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
function renderGaleri(items, containerId = "galeri-list", limit) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    setListState(containerId, "<div class=\"text-muted\">Tidak ada data galeri.</div>");
    return;
  }

  const list = typeof limit === "number" ? items.slice(0, limit) : items;
  container.innerHTML = list
    .map((item) => {
      const title = item.judul || item.title || "Judul belum tersedia";
      const desc = item.deskripsi || item.description || "Deskripsi belum tersedia";
      const image = item.gambar_url || item.image_url || "";
      const imageBlock = image
        ? `<img src="${image}" class="gallery-image" alt="${title}" loading="lazy" />`
        : `<div class="media-placeholder"></div>`;

      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 card-soft hover-lift">
            ${imageBlock}
            <div class="card-body">
              <span class="badge badge-label">Supabase</span>
              <h5 class="card-title mt-3">${title}</h5>
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
    setListState("profil-list", "<div class=\"text-muted\">Tidak ada data profil.</div>");
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.judul || item.title || "Judul belum tersedia";
      const body = item.isi || item.content || "Konten belum tersedia";
      return `
        <div class="col-lg-6">
          <div class="card h-100 card-soft hover-lift">
            <div class="card-body">
              <span class="badge badge-label">Supabase</span>
              <h5 class="card-title mt-3">${title}</h5>
              <p class="card-text">${body}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderProfilHighlights(items) {
  const container = document.getElementById("profil-highlight");
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "";
    return;
  }

  const highlights = items.slice(0, 3);
  container.innerHTML = highlights
    .map((item) => {
      const title = item.judul || item.title || "Informasi";
      const body = item.isi || item.content || "Konten belum tersedia";
      return `
        <div class="col-md-4">
          <div class="card h-100 card-soft">
            <div class="card-body">
              <span class="badge badge-label">Ringkas</span>
              <h6 class="mt-3">${title}</h6>
              <p class="mb-0">${body}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderAboutSection(items) {
  const container = document.getElementById("about-content");
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "<p class=\"text-muted\">Profil desa belum tersedia.</p>";
    return;
  }

  const first = items[0];
  const title = first.judul || first.title || "Tentang Desa Jamus";
  const body = first.isi || first.content || "Konten profil belum tersedia.";
  container.innerHTML = `
    <h5 class="mb-2">${title}</h5>
    <p class="text-muted">${body}</p>
  `;
}

function renderWeather(data) {
  const container = document.getElementById("weather-card");
  if (!container) {
    return;
  }

  if (!data || !data.main || !data.weather || !data.weather[0]) {
    setBlockState("weather-card", "<div class=\"text-muted\">Data cuaca belum tersedia.</div>");
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
          <span class="badge badge-label">OpenWeather</span>
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
  const src = `https://www.google.com/maps?q=${lat},${lon}&hl=id&z=14&output=embed`;

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

  setBlockLoading("weather-card", "Memuat cuaca terkini...");

  try {
    const config = await fetchJson("/api/config");
    const apiKey = config?.weatherApiKey;

    if (!apiKey) {
      setBlockError("weather-card", "WEATHER_API_KEY belum diisi di server.");
      return;
    }

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
    setBlockError("weather-card", "Gagal memuat data cuaca.");
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
  if (!document.getElementById("berita-list")) {
    return;
  }

  setListLoading("berita-list", "Memuat berita desa...");

  try {
    const data = await fetchJson("/api/berita");
    console.log("API response (/api/berita):", data);
    renderBerita(data);
  } catch (error) {
    console.error("API error:", error);
    setListError("berita-list", "Berita belum dapat dimuat.");
  }
}

// Load staff data from the backend and render cards.
async function loadPerangkat() {
  if (!document.getElementById("perangkat-list")) {
    return;
  }

  setListLoading("perangkat-list", "Memuat perangkat desa...");

  try {
    const data = await fetchJson("/api/perangkat");
    console.log("API response (/api/perangkat):", data);
    renderPerangkat(data);
    setApiStatus(true);
  } catch (error) {
    console.error("API error:", error);
    setListError("perangkat-list", "Perangkat desa belum dapat dimuat.");
    setApiStatus(false);
  }
}

// Load gallery data from the backend and render cards.
async function loadGaleri() {
  if (!document.getElementById("galeri-list") && !document.getElementById("galeri-preview")) {
    return;
  }

  if (document.getElementById("galeri-list")) {
    setListLoading("galeri-list", "Memuat galeri desa...");
  }

  if (document.getElementById("galeri-preview")) {
    setListLoading("galeri-preview", "Memuat galeri desa...");
  }

  try {
    const data = await fetchJson("/api/galeri");
    console.log("API response (/api/galeri):", data);
    if (document.getElementById("galeri-list")) {
      renderGaleri(data, "galeri-list");
    }
    if (document.getElementById("galeri-preview")) {
      renderGaleri(data, "galeri-preview", 6);
    }
  } catch (error) {
    console.error("API error:", error);
    if (document.getElementById("galeri-list")) {
      setListError("galeri-list", "Galeri belum dapat dimuat.");
    }
    if (document.getElementById("galeri-preview")) {
      setListError("galeri-preview", "Galeri belum dapat dimuat.");
    }
  }
}

// Load profile data from the backend and render cards.
async function loadProfil() {
  if (!document.getElementById("profil-list") && !document.getElementById("about-content")) {
    return;
  }

  if (document.getElementById("profil-list")) {
    setListLoading("profil-list", "Memuat profil desa...");
  }

  if (document.getElementById("about-content")) {
    setBlockLoading("about-content", "Memuat profil desa...");
  }

  try {
    const data = await fetchJson("/api/profil");
    console.log("API response (/api/profil):", data);
    renderProfil(data);
    renderProfilHighlights(data);
    renderAboutSection(data);
  } catch (error) {
    console.error("API error:", error);
    if (document.getElementById("profil-list")) {
      setListError("profil-list", "Profil desa belum dapat dimuat.");
    }
    if (document.getElementById("about-content")) {
      setBlockError("about-content", "Profil desa belum dapat dimuat.");
    }
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

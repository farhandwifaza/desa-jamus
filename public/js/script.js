const API_BASE = "";

// Small helper to get JSON from the backend.
async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

// Render news cards on the Berita page.
function renderBerita(items) {
  const container = document.getElementById("berita-list");
  if (!container) {
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = "<p class=\"text-muted\">Belum ada berita.</p>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.judul || item.title || "Judul belum tersedia";
      const date = item.tanggal || item.date || "Tanggal belum tersedia";
      const body = item.isi || item.content || "Konten belum tersedia";
      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
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
    container.innerHTML = "<p class=\"text-muted\">Data perangkat belum tersedia.</p>";
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const name = item.nama || item.name || "Nama belum tersedia";
      const role = item.jabatan || item.role || "Jabatan belum tersedia";
      const info = item.deskripsi || item.description || "Informasi belum tersedia";
      return `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="text-muted">${role}</p>
              <p class="card-text">${info}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// Render weather card (for example, on the home page).
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
  const city = data.name || "Lokasi";
  const description = data.weather[0].description || "";

  container.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Cuaca ${city}</h5>
        <p class="display-6 mb-0">${temp}&deg;C</p>
        <p class="text-muted">${description}</p>
      </div>
    </div>
  `;
}

// Load news data from the backend and render cards.
async function loadBerita() {
  try {
    const data = await fetchJson("/api/berita");
    renderBerita(data);
  } catch (error) {
    const container = document.getElementById("berita-list");
    if (container) {
      container.innerHTML = "<p class=\"text-danger\">Gagal memuat data dari server.</p>";
    }
  }
}

// Load staff data from the backend and render cards.
async function loadPerangkat() {
  try {
    const data = await fetchJson("/api/perangkat");
    renderPerangkat(data);
  } catch (error) {
    const container = document.getElementById("perangkat-list");
    if (container) {
      container.innerHTML = "<p class=\"text-danger\">Gagal memuat data dari server.</p>";
    }
  }
}

// Load weather data from the backend and render card.
async function loadWeather() {
  try {
    const data = await fetchJson("/api/weather");
    renderWeather(data);
  } catch (error) {
    const container = document.getElementById("weather-card");
    if (container) {
      container.innerHTML = "<p class=\"text-danger\">Gagal memuat data dari server.</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadBerita();
  loadPerangkat();
  loadWeather();
});

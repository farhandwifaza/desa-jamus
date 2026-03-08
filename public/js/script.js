const API_BASE = "";

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
          <div class="card h-100">
            ${imageBlock}
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
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
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">${body}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
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
  } catch (error) {
    console.error("API error:", error);
    setError("perangkat-list");
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

// Check API status on the home page.
async function loadApiStatus() {
  const statusEl = document.getElementById("api-status");
  if (!statusEl) {
    return;
  }

  try {
    const data = await fetchJson("/api/perangkat");
    console.log("API response:", data);
    statusEl.className = "alert alert-success";
    statusEl.textContent = "API Status: Connected";
  } catch (error) {
    console.error("API error:", error);
    statusEl.className = "alert alert-danger";
    statusEl.textContent = "API Status: Failed";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadBerita();
  loadPerangkat();
  loadGaleri();
  loadProfil();
  loadApiStatus();
});

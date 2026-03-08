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

document.addEventListener("DOMContentLoaded", () => {
  loadBerita();
  loadPerangkat();
});

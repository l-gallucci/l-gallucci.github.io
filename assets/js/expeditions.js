// === Expeditions Map ===
document.addEventListener("DOMContentLoaded", () => {
  // Load Leaflet
  const leafletCss = document.createElement("link");
  leafletCss.rel = "stylesheet";
  leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(leafletCss);

  const leafletJs = document.createElement("script");
  leafletJs.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  leafletJs.onload = initMap;
  document.body.appendChild(leafletJs);

  async function initMap() {
    const map = L.map("map", {
      center: [0, 20],
      zoom: 2,
      minZoom: 1,
      maxZoom: 6,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Load expeditions from JSON
    const response = await fetch("/assets/data/expeditions.json");
    const expeditions = await response.json();

    // Add markers
    expeditions.forEach((exp) => {
      const marker = L.circleMarker(exp.coords, {
        radius: 6,
        color: "#00d400",
        fillColor: "#00d400",
        fillOpacity: 0.8,
      }).addTo(map);

      const popupHtml = `
        <div style="text-align:center;">
          <img src="${exp.logo}" alt="${exp.name}" class="popup-logo" />
          <strong>${exp.name}</strong><br>
          <span style="font-size:0.85rem; color:#aaa;">${exp.year} · ${exp.ship}</span><br>
          <em style="font-size:0.8rem;">${exp.region}</em><br>
          <p style="font-size:0.8rem; color:#ccc; margin-top:6px;">${exp.description}</p>
          <a href="${exp.link}" target="_blank" style="font-size:0.8rem; color:#58a6ff;">Cruise Report ↗</a>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
    });
  }
});
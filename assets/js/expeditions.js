// === Expeditions Map ===
document.addEventListener("DOMContentLoaded", () => {
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

    expeditions.forEach((exp) => {
      let color;
      switch (exp.status) {
        case "future":
          color = "#58a6ff"; // blu chiaro
          break;
        default:
          color = "#d41500"; // verde per passate
      }

      const marker = L.circleMarker(exp.coords, {
        radius: 7,
        color: color,
        fillColor: color,
        fillOpacity: 0.85,
        weight: 1,
      }).addTo(map);

      const popupHtml = `
        <div style="text-align:center;">
          <img src="${exp.logo}" alt="${exp.name}" class="popup-logo" />
          <strong>${exp.name}</strong><br>
          <span style="font-size:0.85rem; color:#aaa;">${exp.year} · ${exp.ship}</span><br>
          <em style="font-size:0.8rem;">${exp.region}</em><br>
          <p style="font-size:0.8rem; color:#ccc; margin-top:6px;">${exp.description}</p>
          <span style="font-size:0.75rem; display:block; margin-top:5px; color:${color}; font-weight:600;">
            ${exp.status === "future" ? "Upcoming Expedition" :
              exp.status === "ongoing" ? "Ongoing Mission" :
              "Completed Expedition"}
          </span>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoClose: true,
        closeOnClick: true,
        className: "expedition-popup",
      });
    });
  }
});
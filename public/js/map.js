(function () {
  const apiBase = window.location.origin;
  let leafletMap = null;
  let initialized = false;

  async function init() {
    if (initialized) return;
    initialized = true;

    const res = await fetch(`${apiBase}/api/districts`);
    const { districts, statusMeta } = await res.json();

    leafletMap = L.map("map", { scrollWheelZoom: false }).setView([11.0, 78.4], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 12
    }).addTo(leafletMap);

    const listEl = document.getElementById("districtList");
    listEl.innerHTML = "";

    districts.forEach(d => {
      const color = statusMeta[d.status].color;

      const marker = L.circleMarker([d.lat, d.lng], {
        radius: 9,
        fillColor: color,
        color: "#fff",
        weight: 2,
        fillOpacity: 0.9
      }).addTo(leafletMap);

      marker.bindPopup(
        `<b>${d.name}</b><br/>Depth: ${d.depthToWaterM} m (${d.trend})<br/>Status: ${d.status}<br/>Recharge: ${d.rechargeRatePct}%`
      );

      const card = document.createElement("div");
      card.className = "district-card";
      card.innerHTML = `
        <div class="dc-top">
          <span class="dc-name">${d.name}</span>
          <span class="dc-status" style="background:${color}">${d.status}</span>
        </div>
        <div class="dc-depth">Depth ${d.depthToWaterM} m · Recharge ${d.rechargeRatePct}%</div>
      `;
      card.addEventListener("click", () => {
        leafletMap.setView([d.lat, d.lng], 10);
        marker.openPopup();
      });
      listEl.appendChild(card);
    });
  }

  window.AquaMap = { init, get initialized() { return initialized; } };
})();

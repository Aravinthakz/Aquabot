document.addEventListener("DOMContentLoaded", async () => {
  const apiBase = window.location.origin;
  const select = document.getElementById("reportDistrict");
  const btn = document.getElementById("reportBtn");
  const preview = document.getElementById("reportPreview");

  let districts = [];
  let statusMeta = {};

  try {
    const res = await fetch(`${apiBase}/api/districts`);
    const data = await res.json();
    districts = data.districts;
    statusMeta = data.statusMeta;

    select.innerHTML = districts.map(d => `<option value="${d.id}">${d.name}</option>`).join("");
    renderPreview(districts[0]);
  } catch (e) {
    select.innerHTML = `<option>Unable to load districts</option>`;
  }

  function renderPreview(d) {
    if (!d) return;
    const color = statusMeta[d.status]?.color || "#333";
    preview.innerHTML = `
      <div class="report-card">
        <h3>${d.name} — Preview</h3>
        <div class="report-row"><span>Status</span><span style="color:${color}">${d.status}</span></div>
        <div class="report-row"><span>Depth to water table</span><span>${d.depthToWaterM} m</span></div>
        <div class="report-row"><span>Recharge rate</span><span>${d.rechargeRatePct}%</span></div>
        <div class="report-row"><span>TDS</span><span>${d.quality.tds} mg/L</span></div>
        <div class="report-row"><span>pH</span><span>${d.quality.ph}</span></div>
        <div class="report-row"><span>Quality</span><span>${d.quality.classification}</span></div>
      </div>
    `;
  }

  select.addEventListener("change", () => {
    const d = districts.find(x => x.id === select.value);
    renderPreview(d);
  });

  btn.addEventListener("click", () => {
    const id = select.value;
    if (!id) return;
    window.location.href = `${apiBase}/api/report/${id}`;
  });
});

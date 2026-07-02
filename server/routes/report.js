const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const { findDistrict, statusMeta } = require("../data/groundwaterData");

function recommendationFor(d) {
  if (d.status === "Safe") {
    return "Extraction is within sustainable limits. Maintain existing monitoring frequency; no new restrictions needed.";
  }
  if (d.status === "Semi-Critical") {
    return "Encourage rainwater harvesting for new constructions. Monitor pre/post-monsoon levels quarterly.";
  }
  if (d.status === "Critical") {
    return "Restrict new high-volume bore wells. Mandate recharge structures for industrial/commercial NOC applicants.";
  }
  return "Impose extraction moratorium on new wells. Prioritize managed aquifer recharge projects and water reuse mandates.";
}

router.get("/:id", (req, res) => {
  const d = findDistrict(req.params.id);
  if (!d) return res.status(404).json({ error: "District not found" });
  const meta = statusMeta[d.status];

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="AquaBot_Report_${d.name}.pdf"`);
  doc.pipe(res);

  // Header
  doc.rect(0, 0, doc.page.width, 90).fill("#0B2545");
  doc.fillColor("#FFFFFF").fontSize(22).font("Helvetica-Bold").text("AquaBot", 50, 28);
  doc.fontSize(11).font("Helvetica").text("AI-Powered Groundwater Intelligence & Advisory Report", 50, 56);
  doc.fillColor("#000000");

  doc.moveDown(4);
  doc.fontSize(18).font("Helvetica-Bold").text(`${d.name} District — Groundwater Assessment`, { align: "left" });
  doc.fontSize(10).font("Helvetica").fillColor("#555555").text(`Report generated: ${new Date().toISOString().slice(0, 10)}  |  Data last updated: ${d.lastUpdated}`);
  doc.fillColor("#000000").moveDown(1.2);

  // Status badge
  doc.font("Helvetica-Bold").fontSize(12).fillColor(meta.color).text(`Status: ${d.status}  (trend: ${d.trend})`);
  doc.fillColor("#000000").moveDown(0.8);

  // Section: Resource Assessment
  doc.font("Helvetica-Bold").fontSize(13).text("1. Resource Assessment");
  doc.font("Helvetica").fontSize(11).moveDown(0.3);
  const rows1 = [
    ["Depth to water table", `${d.depthToWaterM} m below ground level`],
    ["Annual recharge rate", `${d.rechargeRatePct}% of extraction demand`],
    ["Average annual rainfall", `${d.rainfallMm} mm`],
    ["Classification", d.status]
  ];
  rows1.forEach(([k, v]) => doc.text(`${k}: `, { continued: true }).font("Helvetica-Bold").text(v).font("Helvetica"));
  doc.moveDown(0.8);

  // Section: Water Quality
  doc.font("Helvetica-Bold").fontSize(13).text("2. Water Quality Report");
  doc.font("Helvetica").fontSize(11).moveDown(0.3);
  const rows2 = [
    ["Total Dissolved Solids (TDS)", `${d.quality.tds} mg/L`],
    ["pH", `${d.quality.ph}`],
    ["Hardness", `${d.quality.hardness} mg/L`],
    ["Overall classification", d.quality.classification]
  ];
  rows2.forEach(([k, v]) => doc.text(`${k}: `, { continued: true }).font("Helvetica-Bold").text(v).font("Helvetica"));
  doc.moveDown(0.8);

  // Section: Advisory
  doc.font("Helvetica-Bold").fontSize(13).text("3. NOC & Regulatory Advisory");
  doc.font("Helvetica").fontSize(11).moveDown(0.3);
  doc.text(meta.advisory);
  doc.moveDown(0.8);

  // Section: Recommendations
  doc.font("Helvetica-Bold").fontSize(13).text("4. Recharge Recommendations");
  doc.font("Helvetica").fontSize(11).moveDown(0.3);
  doc.text(recommendationFor(d));
  doc.moveDown(1.2);

  doc.fontSize(9).fillColor("#888888").text(
    "Disclaimer: This is a demo report generated from a mock dataset for hackathon/prototype purposes. " +
    "Production deployment would integrate live CGWB / State Groundwater Board data feeds.",
    { align: "left" }
  );

  doc.end();
});

module.exports = router;

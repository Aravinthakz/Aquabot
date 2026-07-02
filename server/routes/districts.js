const express = require("express");
const router = express.Router();
const { districts, statusMeta, findDistrict } = require("../data/groundwaterData");

// GET /api/districts -> full list, for map markers
router.get("/", (req, res) => {
  res.json({ districts, statusMeta });
});

// GET /api/districts/:id -> single district detail
router.get("/:id", (req, res) => {
  const d = findDistrict(req.params.id);
  if (!d) return res.status(404).json({ error: "District not found" });
  res.json({ district: d, meta: statusMeta[d.status] });
});

module.exports = router;

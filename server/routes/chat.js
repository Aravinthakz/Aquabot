const express = require("express");
const router = express.Router();
const { districts, statusMeta, findDistrict } = require("../data/groundwaterData");

// --- Lightweight intent engine -------------------------------------------
// Not a trained ML model — a transparent, extensible rule layer. This keeps
// the demo deterministic and explainable for judges, and is the natural slot
// where a real NLU model (e.g. an intent classifier) would be swapped in.

const NOC_GUIDANCE = [
  "For a new groundwater NOC (No Objection Certificate), you generally need to:",
  "1. Check the block's category (Safe / Semi-Critical / Critical / Over-Exploited).",
  "2. Submit Form I to the Groundwater Board with proposed extraction quantity.",
  "3. Critical & Over-Exploited blocks require a mandatory rainwater harvesting plan.",
  "4. Industrial applicants need a water conservation / recycling plan attached.",
  "5. Approval typically takes 30-45 days depending on the block category."
].join("\n");

function listByStatus(status) {
  return districts.filter(d => d.status.toLowerCase() === status.toLowerCase());
}

function formatDistrictSummary(d) {
  return `${d.name}: water table at ${d.depthToWaterM} m depth, status **${d.status}** (${d.trend}), ` +
    `recharge rate ${d.rechargeRatePct}%, quality: ${d.quality.classification} (TDS ${d.quality.tds} mg/L, pH ${d.quality.ph}).`;
}

function detectDistrictMention(text) {
  const lower = text.toLowerCase();
  return districts.find(d => lower.includes(d.name.toLowerCase()));
}

function classify(message) {
  const text = message.toLowerCase().trim();

  if (/^(hi|hello|hey|namaste|vanakkam)\b/.test(text)) {
    return { intent: "greeting" };
  }
  if (/\bnoc\b|no objection|clearance|permit/.test(text)) {
    return { intent: "noc" };
  }
  if (/critical|over-?exploited|worst|danger/.test(text)) {
    return { intent: "list_status", status: text.includes("over") ? "Over-Exploited" : "Critical" };
  }
  if (/safe district|which district.*safe|best district/.test(text)) {
    return { intent: "list_status", status: "Safe" };
  }
  if (/quality|tds|ph\b|hardness|drinkable|potable/.test(text)) {
    return { intent: "quality", district: detectDistrictMention(text) };
  }
  if (/report|pdf|generate|download/.test(text)) {
    return { intent: "report", district: detectDistrictMention(text) };
  }
  if (/level|depth|water table|how much water/.test(text)) {
    return { intent: "level", district: detectDistrictMention(text) };
  }
  if (/list|districts|coverage|which districts/.test(text)) {
    return { intent: "list_all" };
  }
  const mentioned = detectDistrictMention(text);
  if (mentioned) {
    return { intent: "district_overview", district: mentioned };
  }
  return { intent: "fallback" };
}

function respond(message) {
  const { intent, district, status } = classify(message);

  switch (intent) {
    case "greeting":
      return "Vanakkam! I'm AquaBot, your groundwater advisory assistant. Ask me about water levels, quality, NOC guidance, or say a district name — e.g. \"water level in Coimbatore\".";

    case "noc":
      return NOC_GUIDANCE;

    case "list_status": {
      const matches = listByStatus(status);
      if (!matches.length) return `No districts are currently classified as ${status} in this dataset.`;
      return `Districts classified **${status}**:\n` + matches.map(d => `• ${d.name} (${d.depthToWaterM} m depth)`).join("\n");
    }

    case "list_all":
      return "I have live data for: " + districts.map(d => d.name).join(", ") + ". Ask about any of these by name.";

    case "level": {
      if (!district) return "Which district would you like the water level for? e.g. \"water level in Salem\".";
      return `${district.name}'s water table is currently at ${district.depthToWaterM} m below ground, trending ${district.trend}. Status: ${district.status}. ${statusMeta[district.status].advisory}`;
    }

    case "quality": {
      if (!district) return "Which district's water quality would you like? e.g. \"water quality in Madurai\".";
      const q = district.quality;
      return `${district.name} groundwater quality — TDS: ${q.tds} mg/L, pH: ${q.ph}, Hardness: ${q.hardness} mg/L. Overall: ${q.classification}.`;
    }

    case "report": {
      if (!district) return "Tell me which district's report you need, e.g. \"generate report for Chennai\" — or use the Reports tab.";
      return `Report ready for ${district.name}. Use the Reports tab (or the button below) to download the PDF.`;
    }

    case "district_overview":
      return formatDistrictSummary(district) + `\n${statusMeta[district.status].advisory}`;

    default:
      return "I didn't quite catch that. Try asking about a district's water level, quality, NOC guidance, or which districts are critical.";
  }
}

router.post("/", (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }
  const reply = respond(message);
  const mentioned = detectDistrictMention(message);
  res.json({ reply, district: mentioned ? mentioned.id : null });
});

module.exports = router;

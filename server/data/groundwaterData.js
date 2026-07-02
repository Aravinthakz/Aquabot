// Mock groundwater dataset — stands in for CGWB / State Groundwater Board feeds.
// In production this would sync from live government APIs / IoT piezometers.

const districts = [
  {
    id: "chennai",
    name: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    depthToWaterM: 12.4,
    status: "Critical",
    trend: "falling",
    rechargeRatePct: 62,
    rainfallMm: 1400,
    quality: { tds: 1850, ph: 7.6, hardness: 420, classification: "Poor - saline intrusion risk" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "coimbatore",
    name: "Coimbatore",
    lat: 11.0168,
    lng: 76.9558,
    depthToWaterM: 9.1,
    status: "Semi-Critical",
    trend: "stable",
    rechargeRatePct: 78,
    rainfallMm: 700,
    quality: { tds: 610, ph: 7.2, hardness: 250, classification: "Good" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "madurai",
    name: "Madurai",
    lat: 9.9252,
    lng: 78.1198,
    depthToWaterM: 7.8,
    status: "Safe",
    trend: "rising",
    rechargeRatePct: 91,
    rainfallMm: 850,
    quality: { tds: 480, ph: 7.0, hardness: 190, classification: "Good" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "tiruchirappalli",
    name: "Tiruchirappalli",
    lat: 10.7905,
    lng: 78.7047,
    depthToWaterM: 6.4,
    status: "Safe",
    trend: "stable",
    rechargeRatePct: 88,
    rainfallMm: 830,
    quality: { tds: 520, ph: 7.1, hardness: 210, classification: "Good" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "salem",
    name: "Salem",
    lat: 11.6643,
    lng: 78.146,
    depthToWaterM: 14.2,
    status: "Over-Exploited",
    trend: "falling",
    rechargeRatePct: 41,
    rainfallMm: 900,
    quality: { tds: 1420, ph: 7.8, hardness: 380, classification: "Marginal - hardness elevated" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "namakkal",
    name: "Namakkal",
    lat: 11.2189,
    lng: 78.1677,
    depthToWaterM: 11.6,
    status: "Critical",
    trend: "falling",
    rechargeRatePct: 55,
    rainfallMm: 870,
    quality: { tds: 980, ph: 7.4, hardness: 310, classification: "Marginal" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "tirunelveli",
    name: "Tirunelveli",
    lat: 8.7139,
    lng: 77.7567,
    depthToWaterM: 5.9,
    status: "Safe",
    trend: "rising",
    rechargeRatePct: 93,
    rainfallMm: 780,
    quality: { tds: 440, ph: 6.9, hardness: 170, classification: "Good" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "erode",
    name: "Erode",
    lat: 11.341,
    lng: 77.7172,
    depthToWaterM: 10.3,
    status: "Semi-Critical",
    trend: "stable",
    rechargeRatePct: 71,
    rainfallMm: 720,
    quality: { tds: 690, ph: 7.3, hardness: 260, classification: "Good" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "vellore",
    name: "Vellore",
    lat: 12.9165,
    lng: 79.1325,
    depthToWaterM: 13.7,
    status: "Critical",
    trend: "falling",
    rechargeRatePct: 48,
    rainfallMm: 950,
    quality: { tds: 1120, ph: 7.5, hardness: 340, classification: "Marginal" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "thanjavur",
    name: "Thanjavur",
    lat: 10.787,
    lng: 79.1378,
    depthToWaterM: 4.8,
    status: "Safe",
    trend: "rising",
    rechargeRatePct: 96,
    rainfallMm: 1000,
    quality: { tds: 390, ph: 6.8, hardness: 150, classification: "Good" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "dindigul",
    name: "Dindigul",
    lat: 10.3624,
    lng: 77.9695,
    depthToWaterM: 8.9,
    status: "Semi-Critical",
    trend: "stable",
    rechargeRatePct: 74,
    rainfallMm: 810,
    quality: { tds: 560, ph: 7.1, hardness: 220, classification: "Good" },
    lastUpdated: "2026-06-15"
  },
  {
    id: "theni",
    name: "Theni",
    lat: 10.0104,
    lng: 77.4777,
    depthToWaterM: 6.9,
    status: "Safe",
    trend: "rising",
    rechargeRatePct: 89,
    rainfallMm: 950,
    quality: { tds: 460, ph: 6.9, hardness: 180, classification: "Good" },
    lastUpdated: "2026-06-15"
  }
];

const statusMeta = {
  "Safe": { color: "#2F7A52", advisory: "Groundwater extraction is within sustainable limits. Continue regular monitoring." },
  "Semi-Critical": { color: "#D98E4A", advisory: "Extraction is approaching the safe limit. Recharge structures recommended for new industrial NOCs." },
  "Critical": { color: "#C4472B", advisory: "Extraction exceeds recharge in parts of the block. New bore-well NOCs require Groundwater Board clearance." },
  "Over-Exploited": { color: "#7A1F1F", advisory: "Extraction far exceeds annual recharge. New groundwater extraction is restricted; mandatory rainwater harvesting for any approval." }
};

function findDistrict(query) {
  const q = String(query || "").trim().toLowerCase();
  return districts.find(d => d.name.toLowerCase() === q || d.id === q) ||
         districts.find(d => d.name.toLowerCase().includes(q) && q.length > 2);
}

module.exports = { districts, statusMeta, findDistrict };

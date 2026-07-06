const express = require("express");
const cors = require("cors");
const path = require("path");

const chatRoute = require("./routes/chat");
const districtsRoute = require("./routes/districts");
const reportRoute = require("./routes/report");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);
app.use("/api/districts", districtsRoute);
app.use("/api/report", reportRoute);

// Serve frontend
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use((req, res, next) => {
  if (req.path.startsWith("/api/") || req.path === "/health") return next();
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`AquaBot server running at http://${HOST}:${PORT}`);
});

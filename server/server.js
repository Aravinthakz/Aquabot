const express = require("express");
const cors = require("cors");
const path = require("path");

const chatRoute = require("./routes/chat");
const districtsRoute = require("./routes/districts");
const reportRoute = require("./routes/report");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);
app.use("/api/districts", districtsRoute);
app.use("/api/report", reportRoute);

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`AquaBot server running at http://localhost:${PORT}`);
});

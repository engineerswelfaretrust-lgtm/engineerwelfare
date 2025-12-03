const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

// Configure CORS to allow requests from your frontend's origin
const allowedOrigins = [
  process.env.FRONTEND_URL, // production frontend (if set)
  process.env.VITE_FRONTEND_URL, // optional alternative env var
  "http://localhost:5173", // vite dev server origin
  "http://localhost:5000",
  "https://engineerwelfare-yc2s.vercel.app",
  "https://engineerwelfare-yc2s-git-main-erswelfareindia.vercel.app/",
  "https://www.engwelfare.com",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};

app.use(cors(corsOptions));
// Ensure OPTIONS preflight is handled for all routes
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve local uploads directory so fallback file uploads are reachable at /uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Images are stored in Cloudinary when configured; local /uploads is a fallback when Cloudinary isn't configured

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/engineers", require("./routes/engineerRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/debug", require("./routes/debugRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

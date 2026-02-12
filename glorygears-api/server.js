
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());

const allowed = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman/no-origin
      if (allowed.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// Handle preflight explicitly
app.options(/.*/, cors());


const BASE = process.env.RESTDB_BASE_URL;
const API_KEY = process.env.RESTDB_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

if (!BASE || !API_KEY || !JWT_SECRET) {
  console.error("Missing RESTDB_BASE_URL / RESTDB_API_KEY / JWT_SECRET in .env");
  process.exit(1);
}

const restdbHeaders = {
  "Content-Type": "application/json",
  "x-apikey": API_KEY,
};

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

//  REGISTER (creates a new user)
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    // Check if user exists
    const searchUrl = `${BASE}/rest/users?q=${encodeURIComponent(JSON.stringify({ email }))}`;
    const existingRes = await fetch(searchUrl, { headers: restdbHeaders });
    const existing = await existingRes.json();

    if (existing?.length) return res.status(409).json({ error: "Email already registered" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in RestDB
    const createRes = await fetch(`${BASE}/rest/users`, {
      method: "POST",
      headers: restdbHeaders,
      body: JSON.stringify({ email, passwordHash }),
    });

    const created = await createRes.json();
    if (!createRes.ok) return res.status(createRes.status).json({ error: created });

    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
});

// LOGIN (checks credentials and returns a token)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) 
      return res.status(400).json({ error: "Missing email or password" });

    // Find user by email
    const searchUrl = `${BASE}/rest/users?q=${encodeURIComponent(JSON.stringify({ email }))}`;
    const r = await fetch(searchUrl, { headers: restdbHeaders });
    const users = await r.json();

    const user = users?.[0];
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    // Compare password to stored hash
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    // Create token (login pass)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ ok: true, token });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Login API running on http://localhost:${process.env.PORT || 3001}`);
});


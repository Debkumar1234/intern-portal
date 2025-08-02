// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // replace with a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { path: "/", secure: false, httpOnly: true, maxAge: 6000000 }, // set secure: true if using HTTPS
  })
);

// Add root route redirecting to /signin or /dashboard based on session
app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/signin");
  }
});

// Routes
app.get("/signup", (req, res) => {
  res.render("sign_up", { userId: req.session.userId });
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, referralCode, donationAmount } =
    req.body;
  const name = firstName + " " + lastName;

  try {
    // Insert into users table with referral_code and total_donations
    const userResult = await pool.query(
      "INSERT INTO users (name, referral_code, total_donations) VALUES ($1, $2, $3) RETURNING id",
      [name, referralCode, donationAmount || 0]
    );
    const userId = userResult.rows[0].id;

    // Insert into credentials table
    await pool.query(
      "INSERT INTO credentials (user_id, email, password) VALUES ($1, $2, $3)",
      [userId, email, password] // Hash password in production
    );

    res.redirect("/signin");
  } catch (error) {
    console.error(error);
    res.render("sign_up", { error: "Error creating account" });
  }
});

app.get("/signin", (req, res) => {
  res.render("sign_in", { userId: req.session.userId });
});

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    console.log("User not authenticated");
    res.redirect("/signin");
  }
}

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query(
    "SELECT * FROM credentials WHERE email = $1",
    [email]
  );
  const credential = result.rows[0];

  if (credential && credential.password == password) {
    // Use proper password hashing in production
    req.session.userId = credential.user_id; // Store user ID in session
    console.log("User signed in, session set:", req.session.userId);
    res.redirect("/dashboard");
  } else {
    res.render("sign_in", { error: "Invalid credentials" });
  }
});

app.get("/dashboard", isAuthenticated, async (req, res) => {
  console.log("User ID from session:", req.session.userId);
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [
    req.session.userId,
  ]);
  const user = result.rows[0];
  res.render("dashboard", { user, userId: req.session.userId });
});

app.get("/leaderboard", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM users ORDER BY total_donations DESC"
  );
  const users = result.rows;
  res.render("leaderboard", { users, userId: req.session.userId });
});

app.get("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/signin");
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

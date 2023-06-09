const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "vova_secret_key";
const refreshSecretKey = "vova_refresh_secret_key";
const saltRounds = 10;
const pool = new Pool({
  user: "xlfdukbv",
  host: "mouse.db.elephantsql.com",
  database: "xlfdukbv",
  password: "9NHL3xQLpvUl4cqNu1XwMXcHqbRwuXRM",
  port: 5432,
});
router = express.Router();

function generateAccessToken(userId, role) {
  const payload = { userId, role };
  return jwt.sign(payload, secretKey, { expiresIn: "120m" });
}

function generateRefreshToken(userId, role) {
  const payload = { userId, role };
  return jwt.sign(payload, refreshSecretKey, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { login, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query =
      "INSERT INTO users (login, password, role) VALUES ($1, $2, $3)";
    const values = [login, hashedPassword, role];

    await pool.query(query, values);
    const queryToGetId = "SELECT * FROM users WHERE login = $1";
    const valuesToGetId = [login];
    const result = await pool.query(queryToGetId, valuesToGetId);
    const user = result.rows[0];
    const id = user.id;
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);
    res.json({ success: true, accessToken, refreshToken, id });
  } catch (err) {
    console.error("Помилка запиту до бази даних:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE login = $1";
    const values = [login];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);
        const id = user.id;
        res.json({ success: true, accessToken, refreshToken, id });
      } else {
        res.status(401).json({ error: "Невірний логін або пароль" });
      }
    } else {
      res.status(401).json({ error: "Невірний логін або пароль" });
    }
  } catch (err) {
    console.error("Помилка запиту до бази даних:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Необхідний refresh token" });
  }

  jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Недійсний refresh token" });
    }

    const accessToken = generateAccessToken(user.userId, user.role);
    res.json({ success: true, accessToken });
  });
});
router.get("/users", (req, res) => {
  const sql = "SELECT id,login,role FROM users";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      res.status(200).json(result.rows);
    }
  });
});
router.get("/user-role", (req, res) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).json({ error: "Необхідний accessToken" });
  }

  const token = accessToken.replace("Bearer ", "");

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Недійсний accessToken" });
    }

    const { role } = decoded;
    res.json(role);
  });
});
router.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const { login, role } = req.body;

  const query = "UPDATE users SET login = $1, role = $2 WHERE id = $3";
  const values = [login, role, userId];

  pool.query(query, values, (err) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      res.status(200).json({ message: "Інформація про користувача оновлена" });
    }
  });
});
router.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  const sql = "DELETE FROM users WHERE id = $1";
  const values = [userId];

  pool.query(sql, values, (err) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      res.status(200).json({ message: "Користувача видалено" });
    }
  });
});

module.exports = router;

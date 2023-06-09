const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  user: "xlfdukbv",
  host: "mouse.db.elephantsql.com",
  database: "xlfdukbv",
  password: "9NHL3xQLpvUl4cqNu1XwMXcHqbRwuXRM",
  port: 5432,
});

const router = express.Router();
router.get("/", (req, res) => {
  const query = "SELECT * FROM tovary";

  pool.query(query, (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      const products = result.rows;
      res.json({ products });
    }
  });
});
router.get("/:id_tovara", (req, res) => {
  const id_tovara = req.params.id_tovara;
  const query = "SELECT * FROM tovary WHERE id_tovara = $1";

  pool.query(query, [id_tovara], (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      const product = result.rows[0];
      if (product) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Товар не знайдено" });
      }
    }
  });
});
router.post("/", (req, res) => {
  const { name, property1, property2, price, img } = req.body;
  const query = `
    INSERT INTO tovary (name, property1, property2, price, img)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [name, property1, property2, price, img];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      res.json({ success: true });
    }
  });
});
router.delete("/:id_tovara", (req, res) => {
  const id_tovara = req.params.id_tovara;
  const query = "DELETE FROM tovary WHERE id_tovara = $1";

  pool.query(query, [id_tovara], (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      res.json({ success: true });
    }
  });
});
router.put("/:id_tovara", (req, res) => {
  const id_tovara = req.params.id_tovara;
  const { name, property1, property2, price, img } = req.body;

  let query = "UPDATE tovary SET";
  const values = [];
  let paramCount = 1;

  if (name) {
    query += ` name = $${paramCount},`;
    values.push(name);
    paramCount++;
  }

  if (property1) {
    query += ` property1 = $${paramCount},`;
    values.push(property1);
    paramCount++;
  }

  if (property2) {
    query += ` property2 = $${paramCount},`;
    values.push(property2);
    paramCount++;
  }

  if (price) {
    query += ` price = $${paramCount},`;
    values.push(price);
    paramCount++;
  }

  if (img) {
    query += ` img = $${paramCount},`;
    values.push(img);
    paramCount++;
  }

  query = query.slice(0, -1) + " WHERE id_tovara = $" + paramCount;
  values.push(id_tovara);

  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      res.json({ success: true });
    }
  });
});

module.exports = router;

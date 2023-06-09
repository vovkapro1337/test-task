const { Pool } = require("pg");
const express = require("express");
const pool = new Pool({
  user: env.user,
  host: env.host,
  database: env.database,
  password: env.password
  port: env.port,
  ssl: {
    rejectUnauthorized: false,
  },
});
const router = express.Router();

router.get("/products2/:shop", async (req, res) => {
  try {
    const { shop } = req.params;
    let query = "SELECT * FROM items";
    query += ` WHERE shop = ${shop}`;
    const result = await pool.query(query);
    const products = result.rows;
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("An error occurred while fetching products.");
  }
});
router.post("/orders", async (req, res) => {
  try {
    const { name, email, phone, address, items } = req.body;

    const query =
      "INSERT INTO orders (name, email, phone, address,items) VALUES ($1, $2, $3, $4,$5) RETURNING *";
    const values = [name, email, phone, address, items];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({
      error: "An error occurred while inserting data into the orders.",
    });
  }
});
router.get("/orders", async (req, res) => {
  try {
    const { email, phone } = req.query;
    if (!email || !phone) {
      res
        .status(400)
        .json({ error: "Missing query parameter: email or phone" });
      return;
    }

    const query = "SELECT * FROM orders WHERE email = $1 AND phone = $2";
    const values = [email, phone];

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({
      error: "An error occurred while retrieving data from the orders.",
    });
  }
});

module.exports = router;

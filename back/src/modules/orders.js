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
  const query = "SELECT * FROM orders";

  pool.query(query, (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      const orders = result.rows;
      res.json(orders);
    }
  });
});

router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  const query = "SELECT * FROM orders WHERE order_id = $1";

  pool.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних:", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      const order = result.rows[0];
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ error: "Замовлення не знайдено" });
      }
    }
  });
});
router.post("/", async (req, res) => {
  const { user_id, userInfo } = req.body;

  try {
    const cartQuery = "SELECT * FROM cart WHERE user_id = $1";
    const cartResult = await pool.query(cartQuery, [user_id]);
    const cartItems = cartResult.rows[0]?.items || [];
    const paymentSum = await calculatePaymentSum(cartItems);
    cartItems.push(userInfo);
    const insertQuery =
      "INSERT INTO orders (payment_sum, user_id, items) VALUES ($1, $2, $3)";
    await pool.query(insertQuery, [
      paymentSum,
      user_id,
      JSON.stringify(cartItems),
    ]);

    const clearCartQuery = "DELETE FROM cart WHERE user_id = $1";
    await pool.query(clearCartQuery, [user_id]);

    res.status(201).json({
      success: true,
      message: "Замовлення успішно створено",
    });
  } catch (error) {
    console.error("Помилка запиту до бази даних:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

async function calculatePaymentSum(items) {
  let paymentSum = 0;

  for (const item of items) {
    const { id_tovara, quantity } = item;
    const priceQuery = "SELECT price FROM tovary WHERE id_tovara = $1";
    const priceResult = await pool.query(priceQuery, [id_tovara]);

    if (priceResult.rows.length > 0) {
      const price = priceResult.rows[0].price;
      const totalPrice = price * quantity;
      paymentSum += totalPrice;
    }
  }

  return paymentSum;
}

module.exports = router;

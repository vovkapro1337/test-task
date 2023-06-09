const express = require("express");
const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "Shop",
//   password: "12345678",
//   port: 5432,
// });
const pool = new Pool({
  user: "xlfdukbv",
  host: "mouse.db.elephantsql.com",
  database: "xlfdukbv",
  password: "9NHL3xQLpvUl4cqNu1XwMXcHqbRwuXRM",
  port: 5432,
});
const router = express.Router();
router.get("/:user_id", (req, res) => {
  const { user_id } = req.params;
  const query = "SELECT * FROM cart WHERE user_id = $1";
  pool.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      const cart = result.rows[0];

      if (cart) {
        const items = cart.items;
        const totalAmount = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        res.json({ ...cart, totalAmount });
      } else {
        res.json(cart);
      }
    }
  });
});

router.post("/", (req, res) => {
  const { user_id, item } = req.body;

  const query = "SELECT * FROM cart WHERE user_id = $1";
  pool.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("Помилка запиту до бази даних", err);
      res.status(500).json({ error: "Помилка сервера" });
    } else {
      const cart = result.rows[0];

      if (!cart) {
        const newCart = {
          user_id,
          items: [item],
        };

        const insertQuery = "INSERT INTO cart (user_id, items) VALUES ($1, $2)";
        pool.query(
          insertQuery,
          [user_id, JSON.stringify(newCart.items)],
          (err, result) => {
            if (err) {
              console.error("Помилка запиту до бази даних", err);
              res.status(500).json({ error: "Помилка сервера" });
            } else {
              res.status(201).json({
                success: true,
                message: "Товар успішно доданий до корзини",
                totalAmount: item.price * item.quantity,
              });
            }
          }
        );
      } else {
        const items = cart.items;
        const existingItemIndex = items.findIndex(
          (i) => i.id_tovara === item.id_tovara
        );

        if (existingItemIndex !== -1) {
          items[existingItemIndex].quantity += item.quantity;

          if (items[existingItemIndex].quantity <= 0) {
            items.splice(existingItemIndex, 1);
          }
        } else {
          items.push(item);
        }

        const updateQuery = "UPDATE cart SET items = $1 WHERE user_id = $2";
        pool.query(
          updateQuery,
          [JSON.stringify(items), user_id],
          (err, result) => {
            if (err) {
              console.error("Помилка запиту до бази даних", err);
              res.status(500).json({ error: "Помилка сервера" });
            } else {
              res.status(200).json({
                success: true,
                message: "Товар успішно доданий до корзини",
                totalAmount: items.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ),
              });
            }
          }
        );
      }
    }
  });
});

module.exports = router;

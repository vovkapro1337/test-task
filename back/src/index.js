const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const verifyAccessToken = require("./middlewares/verifyAccessToken");
const { Pool } = require("pg");
const fs = require("fs");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, DELETE, PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/orders", require("./modules/orders"));
app.use("/auth", require("./modules/authentication"));
// app.use("/cart", verifyAccessToken, require("./modules/cart"));
// app.use("/assets", express.static("assets"));
app.use("/testTask", require("./modules/testTask"));
app.get("/", (req, res) => {
  res.send("hello world");
});

const db = [
  {
    title: "Mix Meat White",
    image:
      "https://pizzaday.eatery.club/storage/pizzaday/product/icon/3403/6021f1e9c5d4fe4ef486e1be454f2c67.jpg",
    price: 149,
    shop: 2,
    type: "American",
  },
  {
    title: "Four cheeses",
    image:
      "https://pizzaday.eatery.club/storage/pizzaday/product/icon/1270/c60c66d53623d1fd48cb3ebde6cb54ee.jpg",
    price: 129,
    shop: 2,
    type: "Italian",
  },
  {
    title: "Pepperoni",
    image:
      "https://pizzaday.eatery.club/storage/pizzaday/product/icon/1259/26f343c40875959617a836ebad4cf0ff.jpg",
    price: 149,
    shop: 2,
    type: "Italian",
  },
  {
    title: "Family",
    image:
      "https://pizzaday.eatery.club/storage/pizzaday/product/icon/3316/9d2b70a28bf4396008c63516c995527c.jpg",
    price: 99,
    shop: 2,
    type: "Italian",
  },
  {
    title: "Hunting",
    image:
      "https://pizzaday.eatery.club/storage/pizzaday/product/icon/1255/0d819879d22174cbf3e7576c62e4232b.jpg",
    price: 99,
    shop: 2,
    type: "Italian",
  },
  {
    title: "Francesca",
    image:
      "https://pizzaday.eatery.club/storage/pizzaday/product/icon/6886/2b24c5505a0d73805032d636ba308703.jpg",
    price: 109,
    shop: 2,
    type: "Italian",
  },
];

app.post("/products2", async (req, res) => {
  try {
    const insertQuery =
      "INSERT INTO items (title, image, price, shop, type) VALUES ";
    const values = db
      .map(
        (product) =>
          `('${product.title}', '${product.image}', ${product.price}, ${product.shop},'${product.type}')`
      )
      .join(", ");
    const query = insertQuery + values;

    await pool.query(query);

    res.send("Products inserted successfully");
  } catch (error) {
    console.error("Error inserting products:", error);
    res.status(500).send("An error occurred while inserting products.");
  }
});
app.delete("/delete-products", async (req, res) => {
  try {
    const deleteQuery = "DELETE FROM products WHERE shop = 1";
    await pool.query(deleteQuery);
    res.send("Products deleted successfully");
  } catch (error) {
    console.error("Error deleting products:", error);
    res.status(500).send("An error occurred while deleting products.");
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Сервер запущено на порту 3000");
});

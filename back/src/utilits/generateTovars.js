app.get("/fill-table", async (req, res) => {
  try {
    const client = await pool.connect();

    for (let i = 0; i < 10; i++) {
      const name = `Товар ${i}`;
      const property1 = Math.floor(Math.random() * 100) + 1;
      const property2 = Math.floor(Math.random() * 10) + 1;
      const price = Math.random() * 1000;

      await client.query(
        "INSERT INTO tovary (name, property1, property2, price) VALUES ($1, $2, $3, $4)",
        [name, property1, property2, price]
      );
    }

    client.release();
    res.send("Таблица успешно заполнена рандомными данными.");
  } catch (error) {
    console.error("Ошибка при заполнении таблицы:", error);
    res.status(500).send("Произошла ошибка при заполнении таблицы.");
  }
});

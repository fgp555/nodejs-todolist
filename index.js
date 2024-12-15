const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.static("public"));

const database = [{ id: 1, name: "task 1" }];

app.get("/findAll", (req, res) => {
  res.json(database);
});

app.get("/findOne/:id", (req, res) => {
  const { id } = req.params;
  const find = database.find((item) => item.id === +id);
  if (find) {
    res.json(find);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

app.post("/create", (req, res) => {
  const { body } = req;
  const id = database.length + 1;
  database.push({ id, ...body });
  res.json({ id, ...body });
});

app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const find = database.find((item) => item.id === +id);
  if (find) {
    Object.assign(find, body);
    res.json(find);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const findIndex = database.findIndex((item) => item.id === +id);

  if (findIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const deletedItem = database.splice(findIndex, 1)[0];
  res.json(deletedItem);
});

app.listen(PORT, () => {
  console.log("server in localhost:3000");
});

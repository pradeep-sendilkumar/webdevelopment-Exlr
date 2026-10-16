const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
  
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

let dishes = [
  { id: uuidv4(), name: "Ragi Mudde with Sambar", restaurant: "Belagavi Meals", type: "veg", calories: 320, carbs: 58, protein: 9, fat: 5, price: 90 },
  { id: uuidv4(), name: "Grilled Chicken Salad", restaurant: "Fit Bowl", type: "non-veg", calories: 280, carbs: 12, protein: 32, fat: 10, price: 180 },
  { id: uuidv4(), name: "Masala Dosa", restaurant: "Udupi Darshini", type: "veg", calories: 390, carbs: 52, protein: 8, fat: 16, price: 80 },
  { id: uuidv4(), name: "Paneer Bhurji with 2 Chapati", restaurant: "Fit Bowl", type: "veg", calories: 450, carbs: 40, protein: 24, fat: 22, price: 150 },
];


app.get("/dishes", (req, res) => {
  let { maxCalories, maxCarbs, minProtein, type } = req.query;
  let result = dishes;

  if (maxCalories) result = result.filter((d) => d.calories <= Number(maxCalories));
  if (maxCarbs) result = result.filter((d) => d.carbs <= Number(maxCarbs));
  if (minProtein) result = result.filter((d) => d.protein >= Number(minProtein));
  if (type) result = result.filter((d) => d.type === type);

  res.render("index.ejs", { dishes: result, query: req.query });
});


app.get("/dishes/new", (req, res) => {
  res.render("get.ejs");
});


app.post("/dishes", (req, res) => {
  let { name, restaurant, type, calories, carbs, protein, fat, price } = req.body;
  let id = uuidv4();
  dishes.push({
    id, name, restaurant, type,
    calories: Number(calories),
    carbs: Number(carbs),
    protein: Number(protein),
    fat: Number(fat),
    price: Number(price),
  });
  res.redirect("/dishes");
});

app.get("/dishes/:id", (req, res) => {
  let { id } = req.params;
  let dish = dishes.find((d) => d.id === id);
  if (!dish) return res.status(404).send("Dish not found");
  res.render("show.ejs", { dish });
});


app.get("/dishes/:id/edit", (req, res) => {
  let { id } = req.params;
  let dish = dishes.find((d) => d.id === id);
  if (!dish) return res.status(404).send("Dish not found");
  res.render("update.ejs", { dish });
});


app.patch("/dishes/:id", (req, res) => {
  let { id } = req.params;
  let dish = dishes.find((d) => d.id === id);
  if (!dish) return res.status(404).send("Dish not found");

  let { name, restaurant, type, calories, carbs, protein, fat, price } = req.body;
  dish.name = name;
  dish.restaurant = restaurant;
  dish.type = type;
  dish.calories = Number(calories);
  dish.carbs = Number(carbs);
  dish.protein = Number(protein);
  dish.fat = Number(fat);
  dish.price = Number(price);

  res.redirect("/dishes/" + id);
});


app.delete("/dishes/:id", (req, res) => {
  let { id } = req.params;
  dishes = dishes.filter((d) => d.id !== id);
  res.redirect("/dishes");
});

app.listen(port, () => {
  console.log(`The new server port is ${port}`);
});
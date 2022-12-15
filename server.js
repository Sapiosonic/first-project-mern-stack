const { MongoClient } = require("mongodb");
const express = require('express');
let db;

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", async (request, response) => {
  const allAnimals = await db.collection("animals").find().toArray();
  response.render("home", { allAnimals })
});

app.get("/admin", (request, response) => {
  response.send("This is the top secret admin page!");
});

async function start() {
  const client = new MongoClient("mongodb://root:root@localhost:27017/AmazingMernApp?&authSource=admin");
  await client.connect();
  db = client.db();
  app.listen(3000);
}
start();



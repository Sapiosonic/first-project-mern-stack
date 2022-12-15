const { MongoClient } = require("mongodb");
const express = require('express');
let db;

const app = express();

app.get("/", async (request, response) => {
  const allAnimals = await db.collection("animals").find().toArray();
  console.log(allAnimals);
  response.send("Welcome to the homepage");
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



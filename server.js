const { MongoClient, ObjectId } = require("mongodb");
const express = require('express');
const multer = require('multer');
const upload = multer();
const sanitizeHTML = require('sanitize-html');

let db;

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

//async request with JSON
app.use(express.json());
//Traditional HTML form
app.use(express.urlencoded({ extended: false }));

function passwordProtected(request, response, next) {
  response.set("WWW-Authenticate", "Basic realm='Our MERN App'");
  if (request.headers.authorization == "Basic YWRtaW46YWRtaW4=") {
    next();
  } else {
    console.log(request.headers.authorization);
    response.status(401).send("Try again");
  }
}

app.get("/", async (request, response) => {
  const allAnimals = await db.collection("animals").find().toArray();
  response.render("home", { allAnimals })
});

//All the routes after this function will be password protected.
app.use(passwordProtected);

app.get("/admin", (request, response) => {
  response.render("admin");
});

app.get("/api/animals", async (request, response) => {
  const allAnimals = await db.collection("animals").find().toArray();
  response.json(allAnimals);
});

//implementing multi-type form (using multer to enables file send along with data)
app.post("/create-animal", upload.single("photo"), ourCleanup, async (request, response) => {
  console.log(request.body);
  const info = await db.collection("animals").insertOne(request.cleanData);
  const newAnimal = await db.collection("animals").findOne({_id: new ObjectId(info.insertedId)});
  response.send(newAnimal);
});

function ourCleanup(request, response, next) {
  if (typeof request.body.name != "string") request.body.name = "";
  if (typeof request.body.species != "string") request.body.species = "";
  if (typeof request.body._id != "string") request.body._id = "";

  //using sanitize-html
  request.cleanData = {
    name: sanitizeHTML(request.body.name.trim(), {allowedTags: [], allowedAttributes: {}}),
    species: sanitizeHTML(request.body.species.trim(), {allowedTags: [], allowedAttributes: {}}),
  };

  next();
}

async function start() {
  const client = new MongoClient("mongodb://root:root@localhost:27017/AmazingMernApp?&authSource=admin");
  await client.connect();
  db = client.db();
  app.listen(3000);
}
start();



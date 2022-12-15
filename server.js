const express = require('express');

const app = express();

app.get("/", (request, response) => {
  response.send("Welcome to the homepage");
});

app.get("/admin", (request, response) => {
  response.send("This is the top secret admin page!");
});

app.listen(3000);

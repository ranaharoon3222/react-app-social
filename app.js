const express = require("express");
const connectDB = require('./config/db');

const app = express();
// Connet Databsase
connectDB();

app.get("/", (req, res) => {
  res.send("App running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server started");
});

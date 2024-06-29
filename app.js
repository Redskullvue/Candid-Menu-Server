// imports

require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

// MiddleWears
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET ,Head, Options, POST , PUT , DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "auth-token , Origin , X-Requested-With, Content-Type ,Accept"
  );
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("uploades"));

// DataBase Connection ;

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to the DataBase");
  })
  .catch((err) => {
    console.log(err);
  });

// routes prefix

app.use("/api/post", require("./routes/routes"));
//   Starting the server

app.listen(port, () => {
  console.log(`Server Started Succesfully on ${port}`);
});

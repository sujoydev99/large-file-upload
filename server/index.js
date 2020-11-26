// imports

const express = require("express");
const cors = require("cors");
const config = require("config");
// const mongoose = require("mongoose");
const logger = require("morgan");

const error = require("./middlewares/error");
const upload = require("./routes/api/upload");

// initialize express app
app = express();
// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors
app.use(cors());

// logger
app.use(logger("common"));
app.use("/file", upload);
// health check route
app.get("/", (req, res) =>
  res.status(200).json({
    status: 200,
    message: "Health check successful",
  })
);
// routes
app.use(error);

const port = config.get("PORT");

app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);


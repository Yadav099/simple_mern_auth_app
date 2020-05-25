const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");

const Items = require("./Routes/api/items");

const app = express();

//Body parser Middleware
app.use(express.json());
const db = config.get("mongoURI");
//connect to Mongo
mongoose
  .connect(db, {
    useUnifiedTopology: true,

    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });

app.use("/api/items", require("./Routes/api/items"));
app.use("/api/user", require("./Routes/api/user"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

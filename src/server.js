require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

app.listen(port, () => console.log(`App is listening on port ${port}...`));

mongoose.connect(db).then(()=> console.log("DB connected..."))
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookie = require("cookie-parser");

const userRoute = require("./routes/users");
const paperRoute = require("./routes/papers");
const conferenceRoute = require("./routes/conferences");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

app.use("/users", userRoute);
app.use("/papers", paperRoute);
app.use("/conferences", conferenceRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
dotenv.config();
//dbye bağlanma
mongoose
  .connect(
    "mongodb+srv://metinzeren:2751557a@cluster0.tmmwwza.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("bağlandı");
  });
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({}));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my_keyboard_cat", // Buradaki texti değiştireceğiz.
    resave: false,
    saveUninitialized: true,
  })
);
app.get("/", (req, res) => {
  res.status(200).send("first req");
});

app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`app started on port ${port}`);
});

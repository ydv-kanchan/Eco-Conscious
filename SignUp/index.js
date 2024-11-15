const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const profileRouter = require("./routes/profile");
const productsRouter = require("./routes/products");
const editRouter = require("./routes/edit");
const deleteRouter = require("./routes/delete");
const wishlistRouter = require("./routes/wishlist");
// const cartRouter = require('./routes/cart'); // Include your cart route

const errorHandler = require("./middlewares/errorHandler");
const authenticateToken = require("../SignUp/Middlewares/tokenAuthentication");

dotenv.config();

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.options("*", cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files

// Routes
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/api/profile", authenticateToken, profileRouter);
app.use("/api/products", authenticateToken, productsRouter);
app.use("/api/edit", authenticateToken, editRouter);
app.use("/api/delete", authenticateToken, deleteRouter);
app.use("/api/wishlist", authenticateToken, wishlistRouter); // Wishlist route
// app.use('/api/cart', authenticateToken, cartRouter); // Cart route

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

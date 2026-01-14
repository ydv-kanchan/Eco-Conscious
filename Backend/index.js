const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import Routes
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const profileRouter = require("./routes/profile");
const productsRouter = require("./routes/products");
const editRouter = require("./routes/edit");
const deleteRouter = require("./routes/delete");
const wishlistRouter = require("./routes/wishlist");
const cartRouter = require("./routes/cart");
const orderRoutes = require("./routes/order");
const orderhistoryRoutes = require("./routes/orderhistory");
const bestProductRouter = require("./routes/bestProduct");
const verifyRouter = require("./routes/verify");

const errorHandler = require("./Middlewares/errorHandler");
const searchRouter = require("./routes/search");
const alternativeRouter = require("./routes/alternative");
const authenticateToken = require("./Middlewares/tokenAuthentication");
const feedbackRouter = require("./routes/feedback");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection using URI from .env file
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB Connection Error:", error.message));

// Middleware
// Configure CORS for production and development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://eco-conscious.vercel.app",
  "http://localhost:5173"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to the Eco-Conscious API",
    version: "1.0.0",
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    health: `${req.protocol}://${req.get('host')}/health`
  });
});

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/api/profile", authenticateToken, profileRouter);
app.use("/api/products", authenticateToken, productsRouter);
app.use("/api/edit", authenticateToken, editRouter);
app.use("/api/delete", authenticateToken, deleteRouter);
app.use("/api/wishlist", authenticateToken, wishlistRouter);
app.use("/api/cart", authenticateToken, cartRouter);
app.use("/api/order", authenticateToken, orderRoutes);
app.use("/api/search", searchRouter);
app.use("/api/alternatives", alternativeRouter);
app.use("/api/order-history", authenticateToken, orderhistoryRoutes);
app.use("/api/bestproduct", authenticateToken, bestProductRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/verify", verifyRouter);

// Serve static files from React in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed Origins: ${allowedOrigins.join(', ')}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
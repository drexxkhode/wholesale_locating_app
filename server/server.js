require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");

const companyImageRoute = require('./routes/imageRoute');
const adminRoute = require('./routes/adminRoute');
const companyRoute = require("./routes/companyRoute");

const app = express();

// Cors Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:3001",
    "http://192.168.43.99:3000",
    "http://192.168.43.99:3001",
    /\.ngrok-free\.app$/,
    /\.trycloudflare\.com$/,
  ],
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH"]
}));

app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/api/auth", adminRoute);
//app.use("/api/turf", turfRoutes);
//app.use("/api/turf", meilisearchRoutes);
//app.use("/api/map", mapRoutes);
//app.use("/api/users", userRoutes);
//app.use('/api/bookings', bookingRoute);
//app.use('/api/slots', timeslotRoute);      
//app.use('/api/admin', bookingsRoute);  
app.use('/api/company', companyRoute); 
app.use('/api/company/:id/images', companyImageRoute); 
//app.use('/api/enquiries', enquiriesRoute);
//app.use('/api/reviews', reviewRoute);
//app.use('/api/payments', paymentsRoute);
//app.use('/api/super', superAdminRoute);

app.get("/", (req, res) => {
  res.send("North Industrial Area GIS Locator API running");
});

// Connect Redis (non-blocking — server starts even if Redis is unavailable)
const redis = require('./config/RedisClient');
redis.connect();
// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT,"0.0.0.0", () => console.log(`Server running on port ${PORT}`));


 
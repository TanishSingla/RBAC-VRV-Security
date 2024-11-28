const express = require('express');
const authRoutes = require('./routes/auth.route.js');
const connectDB = require('./lib/database/db.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/error.middleware.js');

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Server is working fine" });
});


app.use(cookieParser());

// API routes
app.use("/api/v1/auth", authRoutes);

//error milddleware
app.use(errorMiddleware);

// Start server and connect to the database
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
    connectDB();
});
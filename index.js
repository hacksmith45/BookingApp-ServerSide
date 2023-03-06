const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.js");
const usersRoute = require("./routes/users.js");
const hotelsRoute = require("./routes/hotels.js");
const roomsRoute = require("./routes/rooms.js");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv/config");



const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL);
      console.log("Connected to mongoDB.")
    } catch (error) {
        throw error;
    }
};


app.use(cookieParser());
app.use(express.json());

//middlewares
app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);


app.use((err,req,res,next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        error:errorStatus,
        message:errorMessage,
        stack: err.stack,
    });
})


app.listen(8080, () => {
    connect()
    console.log("Server is listening on port: 8080");
})
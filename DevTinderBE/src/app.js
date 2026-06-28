import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./../src/config/database.js";
// Routes

import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import userRouter from "./routes/user.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/user", userRouter);

// DB Connection
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server is running on port: " + PORT);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { adminAuth, userAuth } from "../src/middlewares/auth.js";

import connectDB from "./../src/config/database.js";
import UserModel from "./models/user.js";

const app = express();
const PORT = 3000;
const SCERET_KEY = "DEV@Tinder@1993";

app.use(express.json());
app.use(cookieParser());

// ----------------------------------------- API creation

// -----------------------------------------
// create the user
app.post("/signup", async (req, res) => {
  const user = req.body;

  // Encrypt the user password
  const passwordHash = await bcrypt.hash(user.password, 10);

  try {
    const newUser = new UserModel({ ...user, password: passwordHash });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
});

// -----------------------------------------
// login the user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found with email: " + email);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password!");
    }

    const token = await jwt.sign({ _id: user._id }, SCERET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token);

    res.send("User logged in successfully!");
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

// -----------------------------------------
// get the user
app.get("/user/:id", userAuth, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found with id: " + userId);
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});

// -----------------------------------------
// get the all user
app.get("/feed", userAuth, async (req, res) => {
  try {
    const user = await UserModel.find();
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

// -----------------------------------------
// find by Id and delete the user
app.delete("/user/:id", userAuth, async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found with id: " + userId);
    } else {
      res.send("User with id " + userId + " deleted successfully!");
    }
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

// -----------------------------------------
// Find by Id and update the user
app.patch("/user/:id", userAuth, async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  // Add api level validation here if needed like should allow only certain fields, or validate the data format before saving to the database
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "bio",
  ];

  const isValidOperation = Object.keys(updateData).every((key) =>
    ALLOWED_UPDATES.includes(key),
  );

  if (!isValidOperation) {
    return res
      .status(400)
      .send(
        "Invalid updates! Only the following fields can be updated: " +
          ALLOWED_UPDATES.join(", "),
      );
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found with id: " + userId);
    } else {
      res.send(updatedUser);
    }
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

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

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userAuth } from "../middlewares/auth.js";
import UserModel from "../models/user.js";

const authRouter = express.Router();

const SCERET_KEY = "DEV@Tinder@1993";

// -----------------------------------------
// create the user
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
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
// logout the user
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successfully");
});

export default authRouter;

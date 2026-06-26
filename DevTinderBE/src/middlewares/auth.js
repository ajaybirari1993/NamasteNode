import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const SCERET_KEY = "DEV@Tinder@1993";

export const adminAuth = (req, res, next) => {
  const token = "swed";
  const isAuthenticated = token === "xyz123"; // Simulating authentication check

  if (!isAuthenticated) {
    return res.status(401).send("Unauthorized access!");
  }
  next();
};

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }

    const decodedMessage = await jwt.verify(token, SCERET_KEY);
    const { _id } = decodedMessage;

    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

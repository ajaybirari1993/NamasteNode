import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

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
      res.status(401).send("Please login");
    }

    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
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

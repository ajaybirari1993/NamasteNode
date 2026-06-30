import express from "express";

import UserModel from "../models/user.js";
import { userAuth } from "../middlewares/auth.js";
import { isUserEditAllowed } from "../utils/validation.js";

const profileRouter = express.Router();

const ALLOWED_UPDATES = [
  "firstName",
  "lastName",
  "password",
  "age",
  "gender",
  "bio",
];

profileRouter.get("/", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// -----------------------------------------
// get the all user
profileRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const user = await UserModel.find();
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

// get the user
profileRouter.get("/:id", userAuth, async (req, res) => {
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
// find by Id and delete the user
profileRouter.delete("/:id", userAuth, async (req, res) => {
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
profileRouter.patch("/:id", userAuth, async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  // Add api level validation here if needed like should allow only certain fields, or validate the data format before saving to the database

  if (!isUserEditAllowed(updateData, ALLOWED_UPDATES)) {
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
      res.json({
        message: "Profile updated sucessfully",
        data: updatedUser,
      });
    }
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

export default profileRouter;

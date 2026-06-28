import express from "express";

import UserModel from "../models/user.js";

import { userAuth } from "../middlewares/auth.js";

const userRouter = express.Router();

// -----------------------------------------
// get the all user
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const user = await UserModel.find();
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

// get the user
userRouter.get("/:id", userAuth, async (req, res) => {
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
userRouter.delete("/:id", userAuth, async (req, res) => {
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
userRouter.patch("/:id", userAuth, async (req, res) => {
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

export default userRouter;

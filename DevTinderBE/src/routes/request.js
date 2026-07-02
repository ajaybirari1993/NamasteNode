import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequestModel from "../models/connectionRequest.js";
import UserModel from "../models/user.js";

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    if (!["ignored", "interested"].includes(status)) {
      res.status(400).json({
        message: "Invalid request type",
      });
      return;
    }

    const existingUser = await UserModel.findById(toUserId);
    if (!existingUser) {
      res.status(404).json({
        message: "Invalid user id",
      });
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingConnectionRequest) {
      res.status(400).send({
        message: "Connection request already exist !",
      });
      return;
    }

    console.log("Not existing");

    const data = await connectionRequest.save();

    console.log("saved");

    res.status(201).json({
      message: `${req.user.firstName} ${status} to ${existingUser.firstName}`,
      data: data,
    });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const requestId = req.params.requestId;
    const status = req.params.status;

    if (!["accepted", "rejected"].includes(status)) {
      res.status(400).json({
        message: "Invalid status type",
      });
      return;
    }

    const connectionRequest = await ConnectionRequestModel.findOne({
      fromUserId: requestId,
      toUserId: loggedInUserId,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({
      message: "Connection request " + status,
      data,
    });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

export default requestRouter;

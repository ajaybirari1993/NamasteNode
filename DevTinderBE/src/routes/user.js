import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequestModel from "../models/connectionRequest.js";
import UserModel from "../models/user.js";

const userRouter = express.Router();
const USER_DATA = ["firstName", "lastName", "gender"];

userRouter.get("/request/receive", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);

    console.log(connectionRequests);

    res.status(200).json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      // This will only if loggedin user received the request
      // toUserId: loggedUser._id,
      status: "accepted",
      $or: [{ toUserId: loggedUser._id }, { fromUserId: loggedUser._id }],
    })
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    const mappedData = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      data: mappedData,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skipRecords = (page - 1) * limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", ["firstName"])
    // .populate("toUserId", ["firstName"]);

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const usersToShow = await UserModel.find({
      _id: { $nin: [...hideUsersFromFeed, loggedInUser._id] },
    })
      .select("firstName lastName gender bio")
      .skip(skipRecords)
      .limit(limit);

    res.send(usersToShow);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

export default userRouter;

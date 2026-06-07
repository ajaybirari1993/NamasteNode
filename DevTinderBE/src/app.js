import express from "express";
import bcrypt from "bcrypt";
// import { adminAuth, userAuth } from "../src/middlewares/auth.js";

import connectDB from "./../src/config/database.js";
import UserModel from "./models/user.js";

const app = express();
const PORT = 3000;

app.use(express.json());

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

    res.send("User logged in successfully!");
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

// -----------------------------------------
// get the user
app.get("/user/:id", async (req, res) => {
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
app.get("/feed", async (req, res) => {
  try {
    const user = await UserModel.find();
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

// -----------------------------------------
// find by Id and delete the user
app.delete("/user/:id", async (req, res) => {
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
app.patch("/user/:id", async (req, res) => {
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

// As it matches to ID as well keeping the both always calls the by ID not by Email
// Find by email and update the user
// app.patch("/user/:email", async (req, res) => {
//   const userEmail = req.params.email;
//   const updateData = req.body;

//   console.log("Inside the by EMAIL");

//   try {
//     const updatedUser = await UserModel.findOneAndUpdate(
//       { email: userEmail },
//       updateData,
//       { returnDocument: "after" },
//     );

//     if (!updatedUser) {
//       return res.status(404).send("User not found with email: " + userEmail);
//     } else {
//       res.send(updatedUser);
//     }
//   } catch (error) {
//     res.status(500).send("Error updating user: " + error.message);
//   }
// });

// -----------------------------------------Database connection

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

// -----------------------------------------Error handling

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("Internal Server Error before: " + err.message);
//   }
// });

// app.get("/getUser", (req, res) => {
//   throw new Error("Something went wrong while fetching user data!");
//   res.send("User data fetched successfully!");

// try {
//   // Simulating an error
//   throw new Error("Something went wrong while fetching user data!");
// } catch (error) {
//   console.error("Error occurred:", error.message);
//   res.status(500).send("Internal Server Error first: " + error.message);
// }
// });

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(500).send("Internal Server Error after: " + err.message);
//   }
// });

// -----------------------------------------
// app.use("/admin", adminAuth);

// app.get("/admin/getAll", (req, res) => {
//   res.send("Welcome to the admin panel!");
// });

// app.delete("/admin/deleteUser", (req, res) => {
//   res.send("User deleted successfully!");
// });

// app.get("/user/getAllUser", userAuth, (req, res) => {
//   const user = {
//     id: 1,
//     name: "Ajay Birari",
//     profession: "Software Developer",
//   };
//   res.json(user);
// });

// app.get("/user/login", (req, res) => {
//   res.send("User logged in successfully!");
// });

// -----------------------------------------
// Multiple handlers
// app.use("/test", [rh1, rh2], rh3, rh4);
// app.use("/test", rh1, [rh2, rh3], rh4);

// app.use(
//   "/hello",
//   (req, res, next) => {
//     console.log("Hello from the middleware!");
//     // res.send("Hello from the middleware!");
//     next();
//   },
//   (req, res, next) => {
//     console.log("This is the second callback function!");
//     // res.send("This is the second callback function!");
//     next();
//   },
// );

// app.get("/", (req, res) => {
//   res.send("Hello from Express!");
// });

// app.get("/ab*cd", (req, res) => {
//   res.send("Welcome to the DevTinder API!");
// });

// -----------------------------------------

// app.get("/user", (req, res) => {
//   console.log("Query parameters:", req.query);
//   const user = {
//     id: 1,
//     name: "Ajay Birari",
//     profession: "Software Developer",
//   };
//   res.json(user);
// });

// app.post("/user", (req, res) => {
//   res.send("User created successfully!");
// });

// app.delete("/user/:id", (req, res) => {
//   const userId = req.params.id;
//   res.send(`User with id ${userId} deleted successfully!`);
// });

// app.patch("/user/:id", (req, res) => {
//   const userId = req.params.id;
//   res.send(`User with id ${userId} updated successfully!`);
// });

// app.listen(PORT, () => {
//   console.log("Server is running on port: " + PORT);
// });

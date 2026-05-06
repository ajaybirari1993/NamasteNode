import express from "express";
import { adminAuth, userAuth } from "../src/middlewares/auth.js";

const app = express();
const PORT = 3000;

// -----------------------------------------Error handling

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal Server Error before: " + err.message);
  }
});

app.get("/getUser", (req, res) => {
  throw new Error("Something went wrong while fetching user data!");
  res.send("User data fetched successfully!");

  // try {
  //   // Simulating an error
  //   throw new Error("Something went wrong while fetching user data!");
  // } catch (error) {
  //   console.error("Error occurred:", error.message);
  //   res.status(500).send("Internal Server Error first: " + error.message);
  // }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal Server Error after: " + err.message);
  }
});

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

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

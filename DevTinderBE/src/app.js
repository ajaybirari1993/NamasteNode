import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/ab*cd", (req, res) => {
  res.send("Welcome to the DevTinder API!");
});

app.get("/user", (req, res) => {
  console.log("Query parameters:", req.query);
  const user = {
    id: 1,
    name: "Ajay Birari",
    profession: "Software Developer",
  };
  res.json(user);
});

app.post("/user", (req, res) => {
  res.send("User created successfully!");
});

app.delete("/user/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User with id ${userId} deleted successfully!`);
});

app.patch("/user/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User with id ${userId} updated successfully!`);
});

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

export const adminAuth = (req, res, next) => {
  const token = "swed";
  const isAuthenticated = token === "xyz123"; // Simulating authentication check

  if (!isAuthenticated) {
    return res.status(401).send("Unauthorized access!");
  }
  next();
};

export const userAuth = (req, res, next) => {
  const token = "swed";
  const isAuthenticated = token === "abc123"; // Simulating authentication check

  if (!isAuthenticated) {
    return res.status(401).send("Unauthorized access!");
  }
  next();
};

import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ajaybirari1993:jay21%40Arjun@namastenode.av7xanr.mongodb.net/devTinder",
  );
};

export default connectDB;

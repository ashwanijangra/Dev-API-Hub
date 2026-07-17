import mongoose from "mongoose";

const connectDB = async () => {
  try {
   

    await mongoose.connect(process.env.MONGO_URI!, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected");
  } catch (err: any) {
    
  }
};

export default connectDB;
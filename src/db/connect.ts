import mongoose from "mongoose";


export async function connectDB(uri: string) {

     mongoose.set("strictQuery", true);

     await mongoose.connect(uri);

     mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
     mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB"));
     mongoose.connection.on("error", (err) => console.log(`there was an error connecting to MongoDB ${err}`));

}
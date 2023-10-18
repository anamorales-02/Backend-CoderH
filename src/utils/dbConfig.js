import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectToDatabase() {
  try {
    await connect('mongodb+srv://akmorales02:xn2xxYykPwDiFrOD@mongocoder.v2vc0us.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
    throw new Error("Unable to connect to the database");
  }
}

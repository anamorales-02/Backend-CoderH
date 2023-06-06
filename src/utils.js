import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export default __dirname;
export const uploader = multer({ storage });



import { connect } from "mongoose";
export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://akmorales02:xn2xxYykPwDiFrOD@mongocoder.v2vc0us.mongodb.net/"
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}
import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { NextFunction } from "express";
import Nexus from "../nexus/nexus.model";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true, min: 2, max: 30 },
    lastName: { type: String, required: true, trim: true, min: 2, max: 30 },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
      unique: true,
      immutable: true,
    },
    phone: {
      type: String,
      required: [true, "Your Phone Number is not valid"],
      unique: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: ["Admin", "User", "Artist"],
        message: "{VALUE} is not acceptable",
      },
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.post("findOneAndDelete", async function (doc, next: NextFunction) {
  if (doc) {
    await Nexus.deleteMany({ user: doc._id });
  }
  next();
});

const User = model<IUser>("User", userSchema);
export default User;

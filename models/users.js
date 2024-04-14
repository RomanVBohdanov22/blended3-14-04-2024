import { Schema, model } from "mongoose";
import findOrCreatePlugin from "mongoose-findorcreate";

const handleMongooseError = (err, data, next) => {
  err.status = 404;
  next();
};

export const userSchema = new Schema(
  {
    password: {
      type: String,
      //required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);
userSchema.plugin(findOrCreatePlugin);
userSchema.post("save", handleMongooseError);

export const User = model("user", userSchema);

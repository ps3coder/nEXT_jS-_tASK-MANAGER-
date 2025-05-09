import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      // Not required because we may create users via OAuth
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      default: "credentials",
    },
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent recompilation errors
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

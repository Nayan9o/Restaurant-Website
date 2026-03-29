import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true   // ✅ correct
  },
  email: {
    type: String,
    required: true   // ✅ correct
  },
  password: {
    type: String,
    required: true   // ✅ correct
  }
});

export default mongoose.model("User", userSchema);
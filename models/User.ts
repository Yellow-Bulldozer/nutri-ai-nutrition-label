import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  role: "manufacturer" | "user"
  profile: {
    age?: number
    weight?: number
    goal?: "gym" | "weight_loss" | "weight_gain" | "normal"
  }
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["manufacturer", "user"],
      required: true,
    },
    profile: {
      age: { type: Number, min: 1, max: 150 },
      weight: { type: Number, min: 1, max: 500 },
      goal: {
        type: String,
        enum: ["gym", "weight_loss", "weight_gain", "normal"],
      },
    },
  },
  { timestamps: true }
)

UserSchema.index({ email: 1 })

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User

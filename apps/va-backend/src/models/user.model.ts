import { Schema, model, InferSchemaType, Types } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },

    isVerified: { type: Boolean, required: true, default: false },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
      default: 'user',
    },
  },
  { timestamps: true }
);

export const User = model('User', userSchema);
export type IUser = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

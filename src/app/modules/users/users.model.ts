/* eslint-disable @typescript-eslint/no-this-alias */

import { model, Schema } from 'mongoose';
import { TFollowing, TPaymentStatus, TUser } from './users.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const followingSchema = new Schema<TFollowing>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { _id: false },
);

const paymentStatusSchema = new Schema<TPaymentStatus>(
  {
    price: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  { _id: false },
);

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    address: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
    },
    isVerified: {
      type: String,
      enum: ['no', 'pending', 'verified'],
      default: 'no',
    },
    following: {
      type: [followingSchema],
      default: [],
    },
    follower: {
      type: [followingSchema],
      default: [],
    },
    paymentStatus: {
      type: paymentStatusSchema,
    },
    needPassChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// encrypt password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

export const UserModel = model<TUser>('User', userSchema);

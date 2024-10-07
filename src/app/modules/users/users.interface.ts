import { Types } from "mongoose";

export type TFollowing = {
    userId: Types.ObjectId;
}

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user';
  address: string;
  profile: string;
  isVerified?: boolean;
  following?: TFollowing[];
  follower?: TFollowing[];
  needPassChange?: boolean;
  passwordChangedAt?: Date;
};

export type TLoginUser = {
  email: string;
  password: string;
};

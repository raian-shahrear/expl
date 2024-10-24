import { Types } from "mongoose";

export type TFollowing = {
    user: Types.ObjectId;
}

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user';
  address: string;
  profile: string;
  isVerified?: 'no' | 'pending' | 'verified';
  following?: TFollowing[];
  follower?: TFollowing[];
  needPassChange?: boolean;
  passwordChangedAt?: Date;
};

export type TLoginUser = {
  email: string;
  password: string;
};

import { Types } from 'mongoose';

export type THost = {
  _id?: Types.ObjectId;
  logo: string;
  name: string;
};
export type TGuest = {
  _id?: Types.ObjectId;
  profile: string;
  name: string;
  designation: string;
};

export type TEvent = {
  title: string;
  eventBy: string;
  eventDetails: string;
  eventPlace: string;
  eventPlaceLink: string;
  eventDate: Date;
  eventTime: string;
  eventImage: string;
  isActive?: boolean;
  hostedBy?: THost[];
  guests?: TGuest[];
};

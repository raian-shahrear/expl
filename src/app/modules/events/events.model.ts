import { model, Schema } from 'mongoose';
import { TEvent, TGuest, THost } from './events.interface';

const hostSchema = new Schema<THost>({
  logo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const guestSchema = new Schema<TGuest>({
  profile: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
});

const eventSchema = new Schema<TEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    eventBy: {
      type: String,
      required: true,
    },
    eventDetails: {
      type: String,
      required: true,
    },
    eventPlace: {
      type: String,
      required: true,
    },
    eventPlaceLink: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventImage: {
      type: String,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hostedBy: {
      type: [hostSchema],
      default: [],
    },
    guests: {
      type: [guestSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const EventModel = model<TEvent>('Event', eventSchema);

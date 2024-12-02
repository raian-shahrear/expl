import { z } from 'zod';

const hostValidationSchema = z.object({
  logo: z.string(),
  name: z.string(),
});
const guestValidationSchema = z.object({
  profile: z.string(),
  name: z.string(),
  designation: z.string(),
});

const createEventValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    eventBy: z.string(),
    eventDetails: z.string(),
    eventPlace: z.string(),
    eventPlaceLink: z.string(),
    eventDate: z.string(),
    eventTime: z.string(),
    eventImage: z.string(),
  }),
});

const createEventHostValidationSchema = z.object({
  body: z.object({
    logo: z.string(),
    name: z.string(),
  }),
});

const createEventGuestValidationSchema = z.object({
  body: z.object({
    profile: z.string(),
    name: z.string(),
    designation: z.string(),
  }),
});

const updateEventValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    eventBy: z.string().optional(),
    eventDetails: z.string().optional(),
    eventPlace: z.string().optional(),
    eventPlaceLink: z.string().optional(),
    eventDate: z.string().optional(),
    eventTime: z.string().optional(),
    eventImage: z.string().optional(),
    isActive: z.boolean().optional(),
    hostedBy: z.array(hostValidationSchema.partial()).optional(),
    guests: z.array(guestValidationSchema.partial()).optional(),
  }),
});

export const EventValidation = {
  createEventValidationSchema,
  createEventHostValidationSchema,
  createEventGuestValidationSchema,
  updateEventValidationSchema,
};

import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    image: z.array(z.string()),
    category: z.string(),
    author: z.string(),
    travelStory: z.string(),
    premium: z
      .object({
        travelGuide: z.string().optional(),
        destinationTips: z.string().optional(),
      })
      .optional(),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.array(z.string()).optional(),
    category: z.string().optional(),
    travelStory: z.string().optional(),
    premium: z
      .object({
        travelGuide: z.string().optional(),
        destinationTips: z.string().optional(),
      })
      .optional(),
  }),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};

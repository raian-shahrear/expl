import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    post: z.string(),
    comment: z.string(),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    comment: z.string().optional(),
  }),
});

export const CommentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};

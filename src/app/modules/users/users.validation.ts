import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z
      .string({ invalid_type_error: 'Password must be a string' })
      .min(6, { message: 'Password must be at least 6 characters' }),
    phone: z.string(),
    address: z.string(),
    profile: z.string(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profile: z.string().optional(),
    cover: z.string().optional(),
    isVerified: z.string().optional(),
  }),
});

const updateProfileCoverValidationSchema = z.object({
  body: z.object({
    cover: z.string().optional(),
  }),
});

const updateFollowValidationSchema = z.object({
  body: z.object({
    followingUserId: z.string(),
  }),
});

const updateUserEmailValidationSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
  }),
});

const updateUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }).email(),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required!' }),
    newPassword: z.string({ required_error: 'New password is required!' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required!' }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  updateUserRoleValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  updateFollowValidationSchema,
  updateUserEmailValidationSchema,
  updateProfileCoverValidationSchema,
};

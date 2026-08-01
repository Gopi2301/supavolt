import { z } from 'zod';
import type { LoginInput, RegisterInput } from '@supavolt/types';

export const loginSchema = z.object({
    email: z.email({ message: 'Invalid email' }),
    password: z.string().min(1, 'Password is required')
}) satisfies z.ZodType<LoginInput>

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email({ message: 'Invalid email' }),
    password: z.string().min(8, 'Password should be at least 8 characters long')
}) satisfies z.ZodType<RegisterInput>
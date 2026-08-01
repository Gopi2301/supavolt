import { z } from 'zod';
import { AuthIntent, AUTH_INTENT } from './constants';
import { loginSchema, registerSchema } from './client.schema';
import type { LoginInput, RegisterInput } from '@supavolt/types';

export const authServerSchema = z.discriminatedUnion('intent', [
    z.object({ intent: z.literal(AUTH_INTENT.LOGIN), ...loginSchema.shape }),
    z.object({ intent: z.literal(AUTH_INTENT.REGISTER), ...registerSchema.shape })
]);
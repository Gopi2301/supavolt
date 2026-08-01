import { IsEmail, MinLength, IsString } from 'class-validator';
import type { LoginInput } from '@supavolt/types';

export class LoginDto implements LoginInput {
    @IsEmail()
    @IsString()
    email: string

    @IsString()
    @MinLength(6)
    password: string
}
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { RegisterInput } from '@supavolt/types'

export class RegisterDto implements RegisterInput {
    @IsEmail()
    @IsString()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsString()
    @MinLength(2)
    name: string
}

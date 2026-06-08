import { IsEmail, IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Matches(/^[a-zA-Z0-9_]{3,30}$/, {
    message: 'Tag must be 3-30 characters: letters, digits, underscore only',
  })
  tag: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

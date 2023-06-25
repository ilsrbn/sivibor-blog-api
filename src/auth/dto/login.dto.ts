import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}

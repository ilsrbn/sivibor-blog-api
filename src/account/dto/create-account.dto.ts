import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}

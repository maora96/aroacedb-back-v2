import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @IsString()
  @IsNotEmpty({ message: "email can't be empty" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "password can't be empty" })
  password: string;
}

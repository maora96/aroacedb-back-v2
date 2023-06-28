import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty({ message: "email can't be empty" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "password can't be empty" })
  password: string;

  @IsString()
  @IsNotEmpty({ message: "name can't be empty" })
  name: string;
}

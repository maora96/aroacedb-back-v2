import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCharacterDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

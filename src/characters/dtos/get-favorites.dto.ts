import { IsArray, IsNotEmpty } from 'class-validator';

export class GetFavoritesDTO {
  @IsArray()
  @IsNotEmpty({ message: "Genre can't be empty" })
  favorites: string[];
}

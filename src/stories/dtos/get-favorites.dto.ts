import { IsArray, IsNotEmpty } from 'class-validator';

export class GetFavoritesDTO {
  @IsArray()
  @IsNotEmpty({ message: "favorites can't be empty" })
  favorites: string[];
}

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import {
  Gender,
  Genres,
  Importance,
  Pairing,
  Relationship,
  RomanticOrientation,
  SexualOrientation,
  TypeOfRep,
} from 'src/utils/types';

export class CreateCharacterDTO {
  @IsString({ message: 'name must be a string.' })
  @IsNotEmpty()
  name: string;

  @IsString({ message: 'author must be a string.' })
  @IsNotEmpty()
  author: string;

  series: string | null;

  @IsArray()
  @IsNotEmpty({ message: "Genre can't be empty" })
  genres: Genres[];

  cover: string | null;

  @IsEnum(TypeOfRep, {
    message: 'TypeOfRep invalid.',
  })
  @IsNotEmpty({ message: "TypeOfRep can't be empty" })
  typeOfRep: TypeOfRep;

  @IsEnum(Importance, {
    message: 'Importance invalid.',
  })
  @IsNotEmpty({ message: "Importance can't be empty" })
  importance: Importance;

  @IsEnum(Pairing, {
    message: 'Pairing invalid.',
  })
  @IsNotEmpty({ message: "Pairing can't be empty" })
  pairing: Pairing | null;

  @IsNotEmpty({ message: "Relationships can't be empty" })
  relationships: Relationship[] | null;

  notesAndWarnings: string | null;

  @IsEnum(SexualOrientation, {
    message: 'SexualOrientation invalid.',
  })
  @IsNotEmpty({ message: "SexualOrientation can't be empty" })
  sexualOrientation: SexualOrientation;

  @IsEnum(RomanticOrientation, {
    message: 'RomanticOrientation invalid.',
  })
  @IsNotEmpty({ message: "RomanticOrientation can't be empty" })
  romanticOrientation: RomanticOrientation;

  @IsEnum(Gender, {
    message: 'Gender invalid.',
  })
  @IsNotEmpty({ message: "Gender can't be empty" })
  gender: Gender;

  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;
}

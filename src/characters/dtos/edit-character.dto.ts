import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  AgeGroup,
  Gender,
  Genres,
  Importance,
  Length,
  Pairing,
  Relationship,
  RomanticOrientation,
  SexualOrientation,
  TypeOfRep,
} from 'src/utils/types';

export class EditCharacterDTO {
  @IsString({ message: 'name must be a string.' })
  @IsOptional()
  name: string;

  @IsString({ message: 'author must be a string.' })
  @IsOptional()
  author: string;

  @IsOptional()
  series: string | null;

  @IsArray()
  @IsOptional()
  genres: Genres[];

  @IsOptional()
  cover: string | null;

  @IsEnum(TypeOfRep, {
    message: 'TypeOfRep invalid.',
  })
  @IsOptional()
  typeOfRep: TypeOfRep;

  @IsEnum(Importance, {
    message: 'Importance invalid.',
  })
  @IsOptional()
  importance: Importance;

  @IsEnum(Pairing, {
    message: 'Pairing invalid.',
  })
  @IsOptional()
  pairing: Pairing | null;

  @IsArray()
  @IsOptional()
  relationships: Relationship[] | null;

  @IsOptional()
  notesAndWarnings: string | null;

  @IsEnum(SexualOrientation, {
    message: 'SexualOrientation invalid.',
  })
  @IsOptional()
  sexualOrientation: SexualOrientation;

  @IsEnum(RomanticOrientation, {
    message: 'RomanticOrientation invalid.',
  })
  @IsOptional()
  romanticOrientation: RomanticOrientation;

  @IsEnum(Gender, {
    message: 'Gender invalid.',
  })
  @IsOptional()
  gender: Gender;
}

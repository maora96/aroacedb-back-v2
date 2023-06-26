import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { AgeGroup, Genres, Length } from 'src/utils/types';

export class CreateStoryDTO {
  @IsString({ message: 'title must be a string.' })
  @IsNotEmpty()
  title: string;

  @IsString({ message: 'author must be a string.' })
  @IsNotEmpty()
  author: string;

  series: string | null;

  volume: number | null;

  @IsArray()
  @IsNotEmpty({ message: "Genre can't be empty" })
  genres: Genres[];

  cover: string | null;

  @IsString({ message: 'description must be a string.' })
  @IsNotEmpty()
  description: string;

  @IsEnum(Length, {
    message: 'Length invalid.',
  })
  @IsNotEmpty({ message: "Length can't be empty" })
  length: Length;

  ageGroup: AgeGroup | null;

  notesAndWarnings: string | null;

  repNotesAndWarnings: string | null;

  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;
}

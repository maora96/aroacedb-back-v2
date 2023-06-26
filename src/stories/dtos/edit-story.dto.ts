import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { AgeGroup, Genres, Length } from 'src/utils/types';

export class EditStoryDTO {
  @IsString({ message: 'title must be a string.' })
  @IsOptional()
  title: string;

  @IsString({ message: 'author must be a string.' })
  @IsOptional()
  author: string;

  @IsOptional()
  series: string | null;

  @IsOptional()
  volume: number | null;

  @IsArray()
  @IsOptional()
  genres: Genres[];

  @IsOptional()
  cover: string | null;

  @IsString({ message: 'description must be a string.' })
  @IsOptional()
  description: string;

  @IsOptional()
  ageGroup: AgeGroup | null;

  @IsEnum(Length, {
    message: 'Length invalid.',
  })
  @IsOptional()
  length: Length;

  @IsOptional()
  notesAndWarnings: string | null;

  @IsOptional()
  repNotesAndWarnings: string | null;
}

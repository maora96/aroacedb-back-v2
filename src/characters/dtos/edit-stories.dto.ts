import { IsArray } from 'class-validator';

export class EditStoriesDTO {
  @IsArray()
  storiesIds: string[];
}

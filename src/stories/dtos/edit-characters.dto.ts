import { IsArray } from 'class-validator';

export class EditCharactersDTO {
  @IsArray()
  charactersIds: string[];
}

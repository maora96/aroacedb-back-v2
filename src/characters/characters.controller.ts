import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCharacterDTO } from './dtos/create-character.dto';
import { CharactersService } from './characters.service';
import { CharacterFilters, SearchFilters } from 'src/utils/filters';
import { GetFavoritesDTO } from './dtos/get-favorites.dto';
import { EditCharacterDTO } from './dtos/edit-character.dto';
import { EditStoriesDTO } from './dtos/edit-stories.dto';

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post('search')
  getManyAdvanced(@Body() body: CharacterFilters) {
    return this.charactersService.getManyAdvanced(body);
  }

  @Get()
  getMany(@Query() queries: SearchFilters) {
    return this.charactersService.getMany(queries);
  }

  @Get('random')
  async getRandom() {
    const content = await this.charactersService.getRandom();
    return { result: content };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const content = await this.charactersService.getOne(id);
    return { result: content };
  }

  @Post('favorites')
  async getFavorites(@Body() body: GetFavoritesDTO) {
    const content = await this.charactersService.getFavorites(body.favorites);
    return {
      favorites: content,
    };
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() body: CreateCharacterDTO) {
    const content = await this.charactersService.create(body);

    return { result: content };
  }

  @Patch(':id')
  async edit(@Param('id') id: string, @Body() body: EditCharacterDTO) {
    const content = await this.charactersService.edit(id, body);

    return content;
  }

  @Patch('/stories/:id')
  async editCharacters(@Param('id') id: string, @Body() body: EditStoriesDTO) {
    const { storiesIds } = body;
    const content = await this.charactersService.editStories(id, storiesIds);

    return content;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.charactersService.delete(id);
  }
}

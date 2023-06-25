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
import { CharacterFilters, CharacterSearchFilters } from 'src/utils/filters';
import { GetFavoritesDTO } from './dtos/get-favorites.dto';
import { EditCharacterDTO } from './dtos/edit-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post('search')
  getManyAdvanced(@Body() body: CharacterFilters) {
    return this.charactersService.getManyAdvanced(body);
  }

  @Get()
  getMany(@Query() queries: CharacterSearchFilters) {
    console.log('queries', queries);
    return this.charactersService.getMany(queries);
  }

  @Get('random')
  async getRandom() {
    const content = await this.charactersService.getRandom();
    return { result: content };
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.charactersService.getOne(id);
  }

  @Post('favorites')
  getFavorites(@Body() body: GetFavoritesDTO) {
    return this.charactersService.getFavorites(body.favorites);
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

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.charactersService.delete(id);
  }
}

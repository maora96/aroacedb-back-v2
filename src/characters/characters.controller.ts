import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCharacterDTO } from './dtos/create-character.dto';
import { CharactersService } from './characters.service';
import {
  CharacterFilters,
  CharacterParams,
  SearchFilters,
} from 'src/utils/filters';
import { GetFavoritesDTO } from './dtos/get-favorites.dto';
import { EditCharacterDTO } from './dtos/edit-character.dto';
import { EditStoriesDTO } from './dtos/edit-stories.dto';
import { AuthGuard } from 'src/admin/admin.guard';

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

  @Get('all-characters')
  getAllCharacters(@Query() param: CharacterParams) {
    if (param.param === 'undefined')
      return {
        result: [],
        total: 0,
      };
    return this.charactersService.getAllCharacters(param);
  }

  @Get('canon')
  getCanonCharacters(@Query() param: CharacterParams) {
    if (param.param === 'undefined')
      return {
        result: [],
        total: 0,
      };
    return this.charactersService.getCanonCharacters(param);
  }

  @Get('random')
  async getRandom() {
    const content = await this.charactersService.getRandom();
    return { result: content };
  }

  @Get('recently-added')
  async getRecentlyAdded() {
    const content = await this.charactersService.getRecentlyAdded();
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

  @UseGuards(AuthGuard)
  @Patch('status/:id')
  async approve(@Param('id') id: string) {
    const content = await this.charactersService.approve(id);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async edit(@Param('id') id: string, @Body() body: EditCharacterDTO) {
    const content = await this.charactersService.edit(id, body);

    return { result: content };
  }

  @Patch('/stories/:id')
  async editCharacters(@Param('id') id: string, @Body() body: EditStoriesDTO) {
    const { storiesIds } = body;
    const content = await this.charactersService.editStories(id, storiesIds);

    return content;
  }

  @Delete(':id/stories/:storyId')
  async removeStoryFromCharacter(
    @Param('id') id: string,
    @Param(':storyId') storyId: string,
  ) {
    const content = await this.charactersService.removeStoryFromCharacter(
      id,
      storyId,
    );

    return content;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const content = await this.charactersService.delete(id);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Get('/admin/:status')
  async getAllAdminCharacters(
    @Param('status') status: boolean,
    @Query() queries: { search: string },
  ) {
    const content = await this.charactersService.getAllAdminCharacters(
      status,
      queries.search,
    );

    return content;
  }
}

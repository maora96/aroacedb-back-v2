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
import { SearchFilters, StoriesFilters } from 'src/utils/filters';
import { StoriesService } from './stories.service';
import { CreateStoryDTO } from './dtos/create-story.dto';
import { EditStoryDTO } from './dtos/edit-story.dto';
import { GetFavoritesDTO } from './dtos/get-favorites.dto';
import { EditCharactersDTO } from './dtos/edit-characters.dto';

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Post('search')
  getManyAdvanced(@Body() body: StoriesFilters) {
    return this.storiesService.getManyAdvanced(body);
  }

  @Get()
  getMany(@Query() queries: SearchFilters) {
    return this.storiesService.getMany(queries);
  }

  @Get('random')
  async getRandom() {
    const content = await this.storiesService.getRandom();
    return { result: content };
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.storiesService.getOne(id);
  }

  @Post('favorites')
  getFavorites(@Body() body: GetFavoritesDTO) {
    return this.storiesService.getFavorites(body.favorites);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() body: CreateStoryDTO) {
    const content = await this.storiesService.create(body);

    return { result: content };
  }

  @Patch(':id')
  async edit(@Param('id') id: string, @Body() body: EditStoryDTO) {
    const content = await this.storiesService.edit(id, body);

    return content;
  }

  @Patch('/characters/:id')
  async editCharacters(
    @Param('id') id: string,
    @Body() body: EditCharactersDTO,
  ) {
    const { charactersIds } = body;
    const content = await this.storiesService.editCharacters(id, charactersIds);

    return content;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.storiesService.delete(id);
  }
}

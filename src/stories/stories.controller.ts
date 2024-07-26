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
import { SearchFilters, StoriesFilters } from 'src/utils/filters';
import { StoriesService } from './stories.service';
import { CreateStoryDTO } from './dtos/create-story.dto';
import { EditStoryDTO } from './dtos/edit-story.dto';
import { GetFavoritesDTO } from './dtos/get-favorites.dto';
import { EditCharactersDTO } from './dtos/edit-characters.dto';
import { AuthGuard } from 'src/admin/admin.guard';

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

  @Get('recently-added')
  async getRecentlyAdded() {
    const content = await this.storiesService.getRecentlyAdded();
    return { result: content };
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

  @UseGuards(AuthGuard)
  @Patch('status/:id')
  async approve(@Param('id') id: string) {
    const content = await this.storiesService.approve(id);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async edit(@Param('id') id: string, @Body() body: EditStoryDTO) {
    const content = await this.storiesService.edit(id, body);

    return { result: content };
  }

  @Patch('/characters/:id')
  async editCharacters(
    @Param('id') id: string,
    @Body() body: EditCharactersDTO,
  ) {
    const { charactersIds } = body;
    const content = await this.storiesService.editCharacters(id, charactersIds);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const content = await this.storiesService.delete(id);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Get('/admin/:status')
  async getAllAdminCharacters(
    @Param('status') status: boolean,
    @Query() queries: { search: string },
  ) {
    const content = await this.storiesService.getAllAdminStories(
      status,
      queries.search,
    );

    return content;
  }
}

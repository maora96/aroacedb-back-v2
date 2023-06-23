import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCharacterDTO } from './dtos/create-character.dto';

@Controller('characters')
export class CharactersController {
  @Get()
  getMany() {}

  @Get('random')
  getRandom() {}

  @Get(':id')
  getOne(@Param('id') id: string) {}

  @Get('favorites')
  getFavorites() {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() body: CreateCharacterDTO) {}

  @Patch(':id')
  edit(@Param('id') id: string, @Body() body: any) {}

  @Delete(':id')
  delete(@Param('id') id: string) {}
}

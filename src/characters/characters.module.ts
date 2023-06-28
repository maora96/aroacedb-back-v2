import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { Character } from './character.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from 'src/stories/story.entity';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService],
  imports: [TypeOrmModule.forFeature([Character, Story])],
})
export class CharactersModule {}

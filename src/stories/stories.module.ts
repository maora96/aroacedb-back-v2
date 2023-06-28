import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { Story } from './story.entity';
import { Character } from 'src/characters/character.entity';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService],
  imports: [TypeOrmModule.forFeature([Story, Character])],
})
export class StoriesModule {}

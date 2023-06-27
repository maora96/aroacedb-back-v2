import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from 'src/stories/story.entity';
import { Character } from 'src/characters/character.entity';
import { Permission } from './permissions.entity';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [TypeOrmModule.forFeature([Story, Character, Permission])],
})
export class AdminModule {}

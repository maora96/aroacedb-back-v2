import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from 'src/stories/story.entity';
import { Character } from 'src/characters/character.entity';
import { Permission } from './permissions.entity';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/constants';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([Story, Character, Permission, User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class AdminModule {}

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

@Module({
  controllers: [CharactersController],
  providers: [CharactersService],
  imports: [TypeOrmModule.forFeature([Character])],
})
export class CharactersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes({
      path: '/characters/status/:id',
      method: RequestMethod.PATCH,
    });
  }
}

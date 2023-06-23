import { Module } from '@nestjs/common';
import { CharactersModule } from './characters/characters.module';

@Module({
  imports: [CharactersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

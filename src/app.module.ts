import { Module } from '@nestjs/common';
import { CharactersModule } from './characters/characters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './characters/character.entity';
import { ConfigModule } from '@nestjs/config';
import { Story } from './stories/story.entity';
import { StoriesModule } from './stories/stories.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CharactersModule,
    StoriesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [Character, Story],
      synchronize: true,

      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST.toString(),
      database: process.env.PGDATABASE,
      port: Number(process.env.PGPORT),
      ssl: {
        rejectUnauthorized: false,
        ca: process.env.CACERT,
      },
      // username: 'postgres',
      // password: 'postgres',
      // host: 'localhost',
      // database: 'aroacedb',
      // port: 5432,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

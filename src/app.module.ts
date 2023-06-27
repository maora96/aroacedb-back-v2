import { Module } from '@nestjs/common';
import { CharactersModule } from './characters/characters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './characters/character.entity';
import { ConfigModule } from '@nestjs/config';
import { Story } from './stories/story.entity';
import { StoriesModule } from './stories/stories.module';
import { AdminModule } from './admin/admin.module';
import { Permission } from './admin/permissions.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CharactersModule,
    StoriesModule,
    AdminModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [Character, Story, Permission],
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

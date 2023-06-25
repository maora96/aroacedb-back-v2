import { Module } from '@nestjs/common';
import { CharactersModule } from './characters/characters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './characters/character.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CharactersModule,
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   entities: [Character],
    //   synchronize: true,
    //   url: process.env.DATABASE_URL,
    //   // host: process.env.POSTGRES_HOST,
    //   // port: Number(process.env.POSTGRES_PORT),
    //   // username: process.env.POSTGRES_USER,
    //   // password: process.env.POSTGRES_PASSWORD,
    //   // database: process.env.POSTGRES_DB,
    //   // ssl: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // host: 'localhost',
      // port: 5432,
      // username: 'postgres',
      // password: 'postgres',
      // database: 'aroacedb',
      entities: [Character],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

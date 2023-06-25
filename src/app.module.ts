import { Module } from '@nestjs/common';
import { CharactersModule } from './characters/characters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './characters/character.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CharactersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [Character],
      synchronize: true,
      // url: process.env.DATABASE_URL,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST.toString(),
      database: process.env.PGDATABASE,
      port: Number(process.env.PGPORT),
      ssl: {
        rejectUnauthorized: false,
        ca: process.env.CACERT,
      },
      // host: process.env.POSTGRES_HOST,
      // port: Number(process.env.POSTGRES_PORT),
      // username: process.env.POSTGRES_USER,
      // password: process.env.POSTGRES_PASSWORD,
      // database: process.env.POSTGRES_DB,
      // ssl: {
      //   rejectUnauthorized: false,
      //   ca: process.env.CACERT,
      // },
      // ssl: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

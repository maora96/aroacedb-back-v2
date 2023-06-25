import knexLib from 'knex';

export const knex = knexLib({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'aroacedb',
    password: 'postgres',
    // host: process.env.POSTGRES_HOST,
    // port: Number(process.env.POSTGRES_PORT),
    // user: process.env.POSTGRES_USER,
    // password: process.env.POSTGRES_PASSWORD,
    // database: process.env.POSTGRES_DB,
  },
});

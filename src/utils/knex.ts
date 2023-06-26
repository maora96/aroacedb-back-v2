import knexLib from 'knex';

export const knex = knexLib({
  client: 'pg',
  // connection: process.env.DATABASE_URL,
  connection: {
    // host: 'localhost',
    // port: 5432,
    // user: 'postgres',
    // database: 'aroacedb',
    // password: 'postgres',

    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT),
    ssl: {
      rejectUnauthorized: false,
      ca: process.env.CACERT,
    },
  },
});

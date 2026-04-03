import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

import BookEntity from '../books/entities/book.entity';

export default registerAs('database', (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [BookEntity],
    synchronize: process.env.NODE_ENV === 'development',
  };
});

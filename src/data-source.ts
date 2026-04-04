import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import BookEntity from './books/entities/book.entity';

// Load the appropriate environment file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFile });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [BookEntity],
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
});

export default dataSource;

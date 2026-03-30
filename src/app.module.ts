import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BooksController } from './books/books.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import BookEntity from './books/entities/book.entity';

@Module({
  imports: [
    BooksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgresHassfath91@',
      database: 'books-library',
      entities: [BookEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController, BooksController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('Database connection successful! [AppModule]');
    } else {
      this.logger.error('Database connection failed.');
    }
  }
}

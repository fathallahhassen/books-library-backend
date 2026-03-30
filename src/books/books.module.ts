import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import BookEntity from './entities/book.entity';

@Module({
  controllers: [BooksController],
  imports: [TypeOrmModule.forFeature([BookEntity])],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}

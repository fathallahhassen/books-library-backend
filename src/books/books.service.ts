import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import BookEntity from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(BookEntity)
    private booksRepository: Repository<BookEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<BookEntity[]> {
    try {
      return await this.booksRepository.find();
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to fetch all books: ${err.message}`, err.stack);
      throw new InternalServerErrorException({
        message: 'Error retrieving books from database',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }

  async create(createBookDto: CreateBookDto): Promise<BookEntity> {
    const existing = await this.findOneById(createBookDto.id);
    if (existing) {
      throw new ConflictException(
        `Book with ID ${createBookDto.id} already exists`,
      );
    }

    try {
      const newBook = this.booksRepository.create(createBookDto);
      return await this.booksRepository.save(newBook);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to create book with ID ${createBookDto.id}: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException({
        message: 'Error creating book in database',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }

  async findOne(id: number): Promise<BookEntity> {
    const book = await this.findOneById(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  private async findOneById(id: number): Promise<BookEntity | null> {
    try {
      return await this.booksRepository.findOneBy({ id });
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Database error during search for book ${id}: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException({
        message: 'Error searching for book in database',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }

  async update(id: number, updateBookDto: Partial<CreateBookDto>) {
    const bookFound = await this.findOne(id);

    try {
      Object.assign(bookFound, updateBookDto);
      return await this.booksRepository.save(bookFound);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to update book with ID ${id}: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException({
        message: 'Error updating book in database',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // Ensure it exists

    try {
      await this.booksRepository.delete(id);
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to delete book with ID ${id}: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException({
        message: 'Error deleting book from database',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }

  async bulkInsert(
    books: CreateBookDto[],
  ): Promise<{ insertedIds: number[]; ignoredIds: number[] }> {
    if (!books || books.length === 0) {
      throw new BadRequestException('No books provided for bulk insert');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ids = books.map((b) => b.id);
      const existingBooks = await queryRunner.manager.find(BookEntity, {
        where: { id: In(ids) },
        select: ['id'],
      });
      const existingIds = new Set(existingBooks.map((b) => b.id));
      const newBooks = books.filter((b) => !existingIds.has(b.id));
      const ignoredIds = Array.from(existingIds);
      const insertedIds: number[] = [];

      if (newBooks.length > 0) {
        const result = await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(BookEntity)
          .values(newBooks)
          .execute();

        // identifiers contain the primary keys of the inserted rows
        result.identifiers.forEach((idObj) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          insertedIds.push(idObj.id);
        });
      }

      await queryRunner.commitTransaction();

      return {
        insertedIds: insertedIds,
        ignoredIds: ignoredIds,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Bulk insert failed: ${err.message}`, err.stack);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        message: 'Error during bulk insertion',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async bulkRemove(
    bookIds: number[],
  ): Promise<{ deletedIds: number[]; notFoundOrIgnored: number[] }> {
    if (!bookIds || bookIds.length === 0) {
      throw new BadRequestException('No IDs provided for bulk deletion');
    }

    try {
      const existingBooks = await this.booksRepository.find({
        where: { id: In(bookIds) },
        select: ['id'],
      });
      const existingIds = existingBooks.map((b) => b.id);
      const existingIdsSet = new Set(existingIds);
      const notFoundOrIgnored = bookIds.filter((id) => !existingIdsSet.has(id));

      if (existingIds.length === 0) {
        throw new NotFoundException('None of the provided IDs were found');
      }

      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(BookEntity)
        .whereInIds(existingIds)
        .execute();

      return {
        deletedIds: existingIds,
        notFoundOrIgnored: notFoundOrIgnored,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const err = error as Error;
      this.logger.error(`Bulk deletion failed: ${err.message}`, err.stack);
      throw new InternalServerErrorException({
        message: 'Error during bulk deletion',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message,
      });
    }
  }
}

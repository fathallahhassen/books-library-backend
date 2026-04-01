import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import BookEntity from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private booksRepository: Repository<BookEntity>,
    private dataSource: DataSource,
  ) {}

  findAll(): Promise<BookEntity[]> {
    return this.booksRepository.find();
  }

  create(createBookDto: CreateBookDto): Promise<BookEntity> {
    const newUser = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(newUser);
  }

  findOne(id: number): Promise<BookEntity | null> {
    return this.booksRepository.findOneBy({ id });
  }

  async update(id: number, updateBookDto: Partial<CreateBookDto>) {
    const bookFound = await this.booksRepository.findOneBy({ id });
    if (!bookFound) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    Object.assign(bookFound, updateBookDto);
    return this.booksRepository.save(bookFound);
  }

  remove(id: number) {
    return this.booksRepository.delete(id);
  }

  async bulkInsert(books: BookEntity[]): Promise<void> {
    // using transaction
    // create a new query runner
    const queryRunner = this.dataSource.createQueryRunner();
    // let's now open a new transaction:
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(BookEntity)
        .values(books)
        .orIgnore()
        .execute();
      // commit transaction now:
      await queryRunner.commitTransaction();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // since we have errors, lets rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release query runner, which is manually created:
      await queryRunner.release();
    }
  }

  async bulkRemove(bookIds: number[]): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(BookEntity)
      .whereInIds(bookIds)
      .execute();
  }
}

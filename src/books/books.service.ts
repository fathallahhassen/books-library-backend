import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import BookEntity from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private booksRepository: Repository<BookEntity>,
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
    // 1. Find the entity you want to update
    const bookFound = await this.booksRepository.findOneBy({ id });
    if (!bookFound) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    Object.assign(bookFound, updateBookDto);

    // 3. Save the modified entity
    return this.booksRepository.save(bookFound);
  }

  remove(id: number) {
    return this.booksRepository.delete(id);
  }
}

import { Test, TestingModule } from '@nestjs/testing';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import BookEntity from './entities/book.entity';

describe('BooksController', () => {
  let controller: BooksController;

  const baseBook: BookEntity = {
    id: 1,
    title: 'Book',
    authors: [],
    summaries: [],
    editors: [],
    translators: [],
    subjects: [],
    bookshelves: [],
    languages: [],
    copyright: false,
    media_type: 'text',
    formats: {},
    download_count: 1,
  };

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: serviceMock }],
    }).compile();

    controller = module.get(BooksController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to service', async () => {
    const dto: CreateBookDto = { ...baseBook };
    serviceMock.create.mockResolvedValue(baseBook);

    await expect(controller.create(dto)).resolves.toEqual(baseBook);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('findAll delegates to service', async () => {
    serviceMock.findAll.mockResolvedValue([baseBook]);

    await expect(controller.findAll()).resolves.toEqual([baseBook]);
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('findOne passes numeric id', async () => {
    serviceMock.findOne.mockResolvedValue(baseBook);

    await expect(controller.findOne(1)).resolves.toEqual(baseBook);
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('update passes numeric id and dto', async () => {
    const dto: UpdateBookDto = { title: 'Updated' };
    const updatedBook: BookEntity = { ...baseBook, title: 'Updated' };
    serviceMock.update.mockResolvedValue(updatedBook);

    await expect(controller.update('1', dto)).resolves.toEqual(updatedBook);
    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('remove passes numeric id', async () => {
    const result = { affected: 1, raw: [] as unknown[] };
    serviceMock.remove.mockResolvedValue(result);

    await expect(controller.remove('1')).resolves.toEqual(result);
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});

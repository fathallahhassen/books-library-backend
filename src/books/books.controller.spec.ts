import { Test, TestingModule } from '@nestjs/testing';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import BookEntity from './entities/book.entity';
import { BulkCreateItemsDto } from './dto/bulk-create-books.dto';

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
    search: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    bulkInsert: jest.fn(),
    bulkRemove: jest.fn(),
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
    const dto: CreateBookDto = <CreateBookDto>{ ...baseBook };
    serviceMock.create.mockResolvedValue(baseBook);

    await expect(controller.create(dto)).resolves.toEqual({
      success: true,
      message: 'Book created successfully',
      data: baseBook,
    });
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('bulkCreate delegates to service', async () => {
    const dto = { items: [baseBook] };
    const result = { insertedIds: [1], ignoredIds: [] };
    serviceMock.bulkInsert.mockResolvedValue(result);

    await expect(
      controller.bulkCreate(<BulkCreateItemsDto>dto),
    ).resolves.toEqual({
      success: true,
      message: 'Bulk create processed',
      data: result,
    });
    expect(serviceMock.bulkInsert).toHaveBeenCalledWith(dto.items);
  });

  it('findAll delegates to service', async () => {
    serviceMock.findAll.mockResolvedValue([baseBook]);

    await expect(controller.findAll()).resolves.toEqual({
      success: true,
      message: 'Books fetched successfully',
      data: [baseBook],
    });
    expect(serviceMock.findAll).toHaveBeenCalled();
  });

  it('findOne passes numeric id', async () => {
    serviceMock.findOne.mockResolvedValue(baseBook);

    await expect(controller.findOne(1)).resolves.toEqual({
      success: true,
      message: 'Book fetched successfully',
      data: baseBook,
    });
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('update passes numeric id and dto', async () => {
    const dto: UpdateBookDto = { title: 'Updated' };
    const updatedBook: BookEntity = { ...baseBook, title: 'Updated' };
    serviceMock.update.mockResolvedValue(updatedBook);

    await expect(controller.update(1, dto)).resolves.toEqual({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    });
    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('search delegates to service', async () => {
    serviceMock.search.mockResolvedValue([baseBook]);

    await expect(controller.search({ q: 'Book' })).resolves.toEqual({
      success: true,
      message: 'Books fetched successfully',
      data: [baseBook],
    });
    expect(serviceMock.search).toHaveBeenCalledWith('Book');
  });

  it('remove passes numeric id', async () => {
    await expect(controller.remove(1)).resolves.toEqual({
      success: true,
      message: 'Book deleted successfully',
    });
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });

  it('bulkDelete delegates to service', async () => {
    const ids = [1, 2];
    const result = { deletedIds: [1, 2], notFoundOrIgnored: [] };
    serviceMock.bulkRemove.mockResolvedValue(result);

    await expect(controller.bulkDelete({ ids })).resolves.toEqual({
      success: true,
      message: 'Bulk delete processed',
      data: result,
    });
    expect(serviceMock.bulkRemove).toHaveBeenCalledWith(ids);
  });
});

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BooksService } from './books.service';
import BookEntity from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  let repo: jest.Mocked<Repository<BookEntity>>;

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

  const repoMock = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const queryBuilderMock = {
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    whereInIds: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    into: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
  };

  const queryRunnerMock = {
    connect: jest.fn(),
    release: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    manager: {
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    },
  };

  const dataSourceMock = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(BookEntity), useValue: repoMock },
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    service = module.get(BooksService);
    repo = module.get(getRepositoryToken(BookEntity));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      repo.find.mockResolvedValue([baseBook]);
      await expect(service.findAll()).resolves.toEqual([baseBook]);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      repo.find.mockRejectedValue(new Error('DB Error'));
      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('create', () => {
    it('should successfully create a book', async () => {
      const dto: CreateBookDto = { ...baseBook };
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockReturnValue(baseBook);
      repo.save.mockResolvedValue(baseBook);

      await expect(service.create(dto)).resolves.toEqual(baseBook);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: dto.id });
    });

    it('should throw ConflictException if book already exists', async () => {
      const dto: CreateBookDto = { ...baseBook };
      repo.findOneBy.mockResolvedValue(baseBook);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on save error', async () => {
      const dto: CreateBookDto = { ...baseBook };
      repo.findOneBy.mockResolvedValue(null);
      repo.create.mockReturnValue(baseBook);
      repo.save.mockRejectedValue(new Error('Save Error'));

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a book if found', async () => {
      repo.findOneBy.mockResolvedValue(baseBook);
      await expect(service.findOne(1)).resolves.toEqual(baseBook);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the book', async () => {
      repo.findOneBy.mockResolvedValue(baseBook);
      const updated: BookEntity = { ...baseBook, title: 'Updated' };
      repo.save.mockResolvedValue(updated);

      await expect(service.update(1, { title: 'Updated' })).resolves.toEqual(
        updated,
      );
    });

    it('should throw NotFoundException if book does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.update(1, { title: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove a book', async () => {
      repo.findOneBy.mockResolvedValue(baseBook);
      repo.delete.mockResolvedValue({ affected: 1, raw: [] });

      await expect(service.remove(1)).resolves.toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if book not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('bulkInsert', () => {
    it('should successfully bulk insert new books', async () => {
      const books = [
        { ...baseBook, id: 1 },
        { ...baseBook, id: 2 },
      ];
      queryRunnerMock.manager.find.mockResolvedValue([]); // No existing books
      queryBuilderMock.execute.mockResolvedValue({
        identifiers: [{ id: 1 }, { id: 2 }],
      });

      const result = await service.bulkInsert(books);

      expect(result).toEqual({
        insertedIds: [1, 2],
        ignoredIds: [],
      });
      expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
    });

    it('should ignore existing books', async () => {
      const books = [
        { ...baseBook, id: 1 },
        { ...baseBook, id: 2 },
      ];
      queryRunnerMock.manager.find.mockResolvedValue([{ id: 1 }]); // ID 1 exists
      queryBuilderMock.execute.mockResolvedValue({
        identifiers: [{ id: 2 }],
      });

      const result = await service.bulkInsert(books);

      expect(result).toEqual({
        insertedIds: [2],
        ignoredIds: [1],
      });
      expect(queryBuilderMock.values).toHaveBeenCalledWith([
        { ...baseBook, id: 2 },
      ]);
    });

    it('should throw BadRequestException if no books provided', async () => {
      await expect(service.bulkInsert([])).rejects.toThrow(BadRequestException);
    });

    it('should rollback and throw InternalServerErrorException on error', async () => {
      queryRunnerMock.manager.find.mockRejectedValue(new Error('error'));
      await expect(service.bulkInsert([baseBook])).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('bulkRemove', () => {
    it('should successfully bulk remove books', async () => {
      const ids = [1, 2];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      repo.find.mockResolvedValue([{ id: 1 }, { id: 2 }] as any);
      queryBuilderMock.execute.mockResolvedValue({ affected: 2 });

      const result = await service.bulkRemove(ids);

      expect(result).toEqual({
        deletedIds: [1, 2],
        notFoundOrIgnored: [],
      });
      expect(queryBuilderMock.whereInIds).toHaveBeenCalledWith([1, 2]);
    });

    it('should identify not found IDs', async () => {
      const ids = [1, 2, 3];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      repo.find.mockResolvedValue([{ id: 1 }] as any);
      queryBuilderMock.execute.mockResolvedValue({ affected: 1 });

      const result = await service.bulkRemove(ids);

      expect(result).toEqual({
        deletedIds: [1],
        notFoundOrIgnored: [2, 3],
      });
    });

    it('should throw NotFoundException if none of the IDs exist', async () => {
      repo.find.mockResolvedValue([]);
      await expect(service.bulkRemove([1, 2])).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if no IDs provided', async () => {
      await expect(service.bulkRemove([])).rejects.toThrow(BadRequestException);
    });
  });
});

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BooksService } from './books.service';
import BookEntity from './entities/book.entity';

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
    orIgnore: jest.fn().mockReturnThis(),
  };

  const queryRunnerMock = {
    connect: jest.fn(),
    release: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    manager: {
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

  it('findAll', async () => {
    repo.find.mockResolvedValue([baseBook]);
    await expect(service.findAll()).resolves.toEqual([baseBook]);
  });

  it('create', async () => {
    const dto: Partial<BookEntity> = { title: 'New title' };
    const created: BookEntity = { ...baseBook, ...dto };

    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(created);

    await expect(service.create(dto as never)).resolves.toEqual(created);
  });

  it('findOne', async () => {
    repo.findOneBy.mockResolvedValue(baseBook);
    await expect(service.findOne(1)).resolves.toEqual(baseBook);
  });

  it('update', async () => {
    repo.findOneBy.mockResolvedValue(baseBook);
    const updated: BookEntity = { ...baseBook, title: 'Updated' };
    repo.save.mockResolvedValue(updated);

    await expect(service.update(1, { title: 'Updated' })).resolves.toEqual(
      updated,
    );
  });

  it('update throws when missing', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.update(1, { title: 'x' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove', async () => {
    const result = { affected: 1, raw: [] as unknown[] };
    repo.delete.mockResolvedValue(result);
    await expect(service.remove(1)).resolves.toEqual(result);
  });

  it('bulkInsert', async () => {
    const books = [baseBook];
    await service.bulkInsert(books);

    expect(dataSourceMock.createQueryRunner).toHaveBeenCalled();
    expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.manager.createQueryBuilder).toHaveBeenCalled();
    expect(queryBuilderMock.insert).toHaveBeenCalled();
    expect(queryBuilderMock.into).toHaveBeenCalledWith(BookEntity);
    expect(queryBuilderMock.values).toHaveBeenCalledWith(books);
    expect(queryBuilderMock.orIgnore).toHaveBeenCalled();
    expect(queryBuilderMock.execute).toHaveBeenCalled();
    expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it('bulkInsert rollbacks on error', async () => {
    queryBuilderMock.execute.mockRejectedValueOnce(new Error('error'));
    await service.bulkInsert([baseBook]);

    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  });

  it('bulkRemove', async () => {
    const ids = [1, 2];
    await service.bulkRemove(ids);

    expect(dataSourceMock.createQueryBuilder).toHaveBeenCalled();
    expect(queryBuilderMock.delete).toHaveBeenCalled();
    expect(queryBuilderMock.from).toHaveBeenCalledWith(BookEntity);
    expect(queryBuilderMock.whereInIds).toHaveBeenCalledWith(ids);
    expect(queryBuilderMock.execute).toHaveBeenCalled();
  });
});

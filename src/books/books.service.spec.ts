import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(BookEntity), useValue: repoMock },
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
});

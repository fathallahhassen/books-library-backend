import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';

const mockBooksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  search: jest.fn().mockResolvedValue([]),
  update: jest.fn(),
  remove: jest.fn(),
  bulkInsert: jest.fn(),
  bulkRemove: jest
    .fn()
    .mockResolvedValue({ deletedIds: [], notFoundOrIgnored: [] }),
};

describe('BooksController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockBooksService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => jest.clearAllMocks());

  describe('POST /books/bulk-delete - DTO validation', () => {
    it('returns 400 when body is not an object with ids array', () => {
      return request(app.getHttpServer())
        .post('/books/bulk-delete')
        .send('not-an-array')
        .expect(400);
    });

    it('returns 400 when ids contains non-integer values', () => {
      return request(app.getHttpServer())
        .post('/books/bulk-delete')
        .send({ ids: [1, 'not-a-number'] })
        .expect(400);
    });
  });

  describe('ParseIntPipe', () => {
    it('GET /books/:id returns 400 for non-numeric id', () => {
      return request(app.getHttpServer()).get('/books/abc').expect(400);
    });

    it('PATCH /books/:id returns 400 for non-numeric id', () => {
      return request(app.getHttpServer()).patch('/books/abc').expect(400);
    });

    it('DELETE /books/:id returns 400 for non-numeric id', () => {
      return request(app.getHttpServer()).delete('/books/abc').expect(400);
    });
  });

  describe('POST /books - DTO validation', () => {
    it('returns 400 when required fields are missing', () => {
      return request(app.getHttpServer()).post('/books').send({}).expect(400);
    });
  });

  describe('POST /books/bulk-create - DTO validation', () => {
    it('returns 400 when items array is empty', () => {
      return request(app.getHttpServer())
        .post('/books/bulk-create')
        .send({ items: [] })
        .expect(400);
    });
  });

  describe('GET /books/search - route ordering', () => {
    it('resolves search before :id route (returns 200, not 400)', () => {
      return request(app.getHttpServer())
        .get('/books/search?q=test')
        .expect(200);
    });
  });
});

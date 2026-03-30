import { Body, Controller, Delete, Get, Param, Patch, Post, } from '@nestjs/common';

import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBody } from '@nestjs/swagger';
import { BulkCreateItemsDto } from './dto/bulk-create-books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiBody({
    type: CreateBookDto,
  })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Post('bulk-create')
  @ApiBody({
    type: BulkCreateItemsDto,
    description: 'The data required to create multiple books',
  })
  bulkCreate(@Body() bulkCreateItemsDto: BulkCreateItemsDto) {
    return this.booksService.bulkInsert(bulkCreateItemsDto.items);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Post('bulk-delete')
  async bulkDelete(@Body() ids: number[]): Promise<void> {
    return this.booksService.bulkRemove(ids);
  }
}

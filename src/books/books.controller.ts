import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

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
  async create(@Body() createBookDto: CreateBookDto) {
    const data = await this.booksService.create(createBookDto);
    return {
      success: true,
      message: 'Book created successfully',
      data,
    };
  }

  @Post('bulk-create')
  @ApiBody({
    type: BulkCreateItemsDto,
    description: 'The data required to create multiple books',
  })
  async bulkCreate(@Body() bulkCreateItemsDto: BulkCreateItemsDto) {
    const result = await this.booksService.bulkInsert(bulkCreateItemsDto.items);
    return {
      success: true,
      message: 'Bulk create processed',
      data: result,
    };
  }

  @Get()
  async findAll() {
    const data = await this.booksService.findAll();
    return {
      success: true,
      message: 'Books fetched successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.booksService.findOne(id);
    return {
      success: true,
      message: 'Book fetched successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const data = await this.booksService.update(id, updateBookDto);
    return {
      success: true,
      message: 'Book updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.booksService.remove(id);
    return {
      success: true,
      message: 'Book deleted successfully',
    };
  }

  @Post('bulk-delete')
  async bulkDelete(@Body() ids: number[]): Promise<{
    success: boolean;
    message: string;
    data: { deletedIds: number[]; notFoundOrIgnored: number[] };
  }> {
    if (!Array.isArray(ids)) {
      throw new BadRequestException('Body must be an array of numeric IDs');
    }

    const hasNonNumbers = ids.some((v) => Number.isNaN(v));
    if (hasNonNumbers) {
      throw new BadRequestException('All IDs must be numbers');
    }

    const result = await this.booksService.bulkRemove(ids);
    return {
      success: true,
      message: 'Bulk delete processed',
      data: result,
    };
  }
}

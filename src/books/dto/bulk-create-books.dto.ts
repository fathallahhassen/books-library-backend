import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { CreateBookDto } from './create-book.dto';

export class BulkCreateItemsDto {
  @ApiProperty({ type: [CreateBookDto] })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBookDto)
  items: CreateBookDto[];
}

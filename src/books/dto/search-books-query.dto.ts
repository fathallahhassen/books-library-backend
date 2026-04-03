import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchBooksQueryDto {
  @ApiProperty({
    description: 'Search term (title or author)',
    example: 'Tolkien',
  })
  @IsString()
  @IsNotEmpty({ message: 'Search query "q" must not be empty' })
  @MinLength(1)
  q: string;
}

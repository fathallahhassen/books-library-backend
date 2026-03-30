import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type BookEditor = {
  name: string;
  birth_year: number;
  death_year: number;
};

export class CreateBookDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  authors: BookEditor[];

  @ApiProperty()
  @IsNotEmpty()
  summaries: string[];

  @ApiProperty()
  editors: BookEditor[];

  @ApiProperty()
  translators: BookEditor[];

  @ApiProperty()
  subjects: string[];

  @ApiProperty()
  bookshelves: string[];

  @ApiProperty()
  languages: string[];

  @ApiProperty()
  @IsBoolean()
  copyright: boolean;

  @ApiProperty()
  @IsString()
  media_type: string;

  @ApiProperty()
  formats: { [key: string]: string };

  @ApiProperty()
  @IsInt()
  download_count: number;
}

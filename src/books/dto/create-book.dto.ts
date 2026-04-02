import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class BookEditor {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  birth_year: number;

  @ApiProperty()
  @IsInt()
  death_year: number;
}

export class CreateBookDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [BookEditor] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookEditor)
  @IsNotEmpty()
  authors: BookEditor[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  summaries: string[];

  @ApiProperty({ type: [BookEditor] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BookEditor)
  editors: BookEditor[];

  @ApiProperty({ type: [BookEditor] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BookEditor)
  translators: BookEditor[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bookshelves: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages: string[];

  @ApiProperty()
  @IsBoolean()
  copyright: boolean;

  @ApiProperty()
  @IsString()
  media_type: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  formats: { [key: string]: string };

  @ApiProperty()
  @IsInt()
  download_count: number;
}

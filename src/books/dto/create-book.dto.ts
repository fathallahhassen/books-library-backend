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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({ type: [BookEditor] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BookEditor)
  editors: BookEditor[];

  @ApiPropertyOptional({ type: [BookEditor] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BookEditor)
  translators: BookEditor[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects: string[];

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bookshelves: string[];

  @ApiPropertyOptional()
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

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  formats: { [key: string]: string };

  @ApiProperty()
  @IsInt()
  download_count: number;
}

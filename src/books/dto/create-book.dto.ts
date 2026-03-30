import { IsString, IsNotEmpty, IsInt, IsBoolean } from 'class-validator';

type BookEditor = {
  name: string;
  birth_year: number;
  death_year: number;
};

export class CreateBookDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  authors: BookEditor[];

  @IsNotEmpty()
  summaries: string[];

  editors: BookEditor[];
  translators: BookEditor[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];

  @IsBoolean()
  copyright: boolean;

  @IsString()
  media_type: string;

  formats: { [key: string]: string };

  @IsInt()
  download_count: number;
}

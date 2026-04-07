type BookEditor = {
  name: string;
  birth_year?: number;
  death_year?: number;
};

export interface BookInterface {
  id: number;
  title: string;
  authors: BookEditor[];
  summaries: string[];
  editors: BookEditor[];
  translators: BookEditor[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: { [key: string]: string };
  download_count: number;
}

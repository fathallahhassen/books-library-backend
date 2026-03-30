import { Column, Entity, PrimaryColumn } from 'typeorm';

interface BookEditor {
  name: string;
  birth_year: number;
  death_year: number;
}

@Entity()
export default class BookEntity {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar')
  title: string;

  @Column('jsonb', { nullable: true })
  authors: BookEditor[];

  @Column('text', { array: true })
  summaries: string[];

  @Column('jsonb', { nullable: true })
  editors: BookEditor[];

  @Column('jsonb', { nullable: true })
  translators: BookEditor[];

  @Column('text', { array: true })
  subjects: string[];

  @Column('text', { array: true })
  bookshelves: string[];

  @Column('text', { array: true })
  languages: string[];

  @Column('boolean')
  copyright: boolean;

  @Column('varchar')
  media_type: string;

  @Column('jsonb', { nullable: true })
  formats: { [key: string]: string };

  @Column('int')
  download_count: number;
}

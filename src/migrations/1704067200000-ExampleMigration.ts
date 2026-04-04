import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class ExampleMigration1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Example 1: Create a new table
    await queryRunner.createTable(
      new Table({
        name: 'book_entity',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'int',
            isPrimary: true,
          }),
          new TableColumn({
            name: 'title',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'authors',
            type: 'jsonb',
            isNullable: true,
          }),
          new TableColumn({
            name: 'summaries',
            type: 'text',
            isArray: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'editors',
            type: 'jsonb',
            isNullable: true,
          }),
          new TableColumn({
            name: 'translators',
            type: 'jsonb',
            isNullable: true,
          }),
          new TableColumn({
            name: 'subjects',
            type: 'text',
            isArray: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'bookshelves',
            type: 'text',
            isArray: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'languages',
            type: 'text',
            isArray: true,
            isNullable: false,
          }),
          new TableColumn({
            name: 'copyright',
            type: 'boolean',
            isNullable: false,
          }),
          new TableColumn({
            name: 'media_type',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'formats',
            type: 'jsonb',
            isNullable: true,
          }),
          new TableColumn({
            name: 'download_count',
            type: 'int',
            isNullable: false,
          }),
        ],
      }),
      true, // ifNotExists
    );

    // Example 2: Create an index
    await queryRunner.createIndex(
      'book_entity',
      new TableIndex({
        name: 'IDX_book_title',
        columnNames: ['title'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: Drop the index first, then the table
    await queryRunner.dropIndex('book_entity', 'IDX_book_title');
    await queryRunner.dropTable('book_entity');
  }
}

# TypeORM Migration Examples

This file contains common migration patterns for database schema changes.

---

## Quick Start Commands

### Generate a Migration (Recommended)
```bash
npx typeorm migration:generate AddNewColumn --dataSource src/data-source.ts
```

### Run Migrations
```bash
# Uses .env.development (default)
npx typeorm migration:run --dataSource src/data-source.ts

# Uses .env.production
NODE_ENV=production npx typeorm migration:run --dataSource src/data-source.ts
```

### Revert Last Migration
```bash
npx typeorm migration:revert --dataSource src/data-source.ts
```

---

## Example 1: Add a New Column

```text
async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumn(
    'book_entity',
    new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'now()',
    }),
  );
}

async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropColumn('book_entity', 'created_at');
}
```

---

## Example 2: Drop a Column

```text
async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropColumn('book_entity', 'old_column_name');
}

async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumn(
    'book_entity',
    new TableColumn({
      name: 'old_column_name',
      type: 'varchar',
      isNullable: true,
    }),
  );
}
```

---

## Example 3: Rename a Column

```text
async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.renameColumn('book_entity', 'old_name', 'new_name');
}

async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.renameColumn('book_entity', 'new_name', 'old_name');
}
```

---

## Example 4: Change Column Type

```text
async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.changeColumn(
    'book_entity',
    'old_column',
    new TableColumn({
      name: 'old_column',
      type: 'int',
      isNullable: false,
    }),
  );
}

async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.changeColumn(
    'book_entity',
    'old_column',
    new TableColumn({
      name: 'old_column',
      type: 'varchar',
      isNullable: true,
    }),
  );
}
```

---

## Example 5: Create a Foreign Key

```text
import { TableForeignKey } from 'typeorm';

async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createForeignKey(
    'book_entity',
    new TableForeignKey({
      columnNames: ['author_id'],
      referencedTableName: 'author_entity',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }),
  );
}

async down(queryRunner: QueryRunner): Promise<void> {
  const table = await queryRunner.getTable('book_entity');
  const foreignKey = table?.foreignKeys.find(
    (fk) => fk.columnNames.indexOf('author_id') !== -1,
  );
  if (foreignKey) {
    await queryRunner.dropForeignKey('book_entity', foreignKey);
  }
}
```

---

## Example 6: Run Custom SQL

```text
async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(
    'UPDATE book_entity SET copyright = false WHERE copyright IS NULL'
  );
}

async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(
    'UPDATE book_entity SET copyright = NULL WHERE copyright = false'
  );
}
```

---

## Example 7: Create an Index

```text
import { TableIndex } from 'typeorm';

async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createIndex(
    'book_entity',
    new TableIndex({
      name: 'IDX_book_title_author',
      columnNames: ['title', 'authors'],
    }),
  );
}

async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropIndex('book_entity', 'IDX_book_title_author');
}
```

---

## Best Practices

1. **Always write both `up()` and `down()` methods** for rollback capability
2. **Test migrations locally before production** - Use `.env.development` first
3. **Keep migrations small and focused** - One logical change per migration
4. **Use auto-generated migrations when possible** - Less error-prone
5. **Add timestamps to migration filenames** - Ensures correct execution order
6. **Document complex migrations** - Add comments explaining the changes

---

## File Naming Convention

`TIMESTAMP-MigrationName.ts`

Example: `1704067200000-AddCreatedAtColumn.ts`

Generate timestamps with: `date +%s` (Unix timestamp)


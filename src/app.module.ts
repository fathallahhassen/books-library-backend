import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BooksController } from './books/books.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import dbConfig from './config/db-config';
import appConfig from './config/app-config';
import { validate } from './config/config.type';

@Module({
  imports: [
    BooksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      //      `${configService.get('APP_PORT')}`
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [dbConfig, appConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('database'),
    }),
  ],
  controllers: [AppController, BooksController],
  providers: [AppService],
})
export class AppModule {}

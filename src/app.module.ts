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
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    BooksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env', '.env.production'],
      load: [dbConfig, appConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow('database'),
    }),
    PrometheusModule.register({
      path: '/metrics', // The endpoint where metrics will be exposed
      defaultMetrics: {
        enabled: true, // Collects default Node.js metrics (CPU, memory, etc.)
      },
    }),
  ],
  controllers: [AppController, BooksController],
  providers: [AppService],
})
export class AppModule {}

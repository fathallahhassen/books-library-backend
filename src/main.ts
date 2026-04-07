import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('books-library')
    .setDescription('books library API description')
    .setVersion('1.0')
    .addTag('books-library')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = configService.get<number>('PORT') ?? 3000;
  app.enableCors({
    origin:
      configService.get<string>('NODE_ENV') === 'production'
        ? configService.get<string>('CORS_ORIGIN') // e.g., 'https://your-frontend.com'
        : true,
    credentials: true,
  });
  await app.listen(port, '0.0.0.0');
}

void bootstrap().then(() => {
  console.log(`Application started`);
});

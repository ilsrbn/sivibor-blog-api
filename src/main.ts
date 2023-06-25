import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '../..', 'public'), {
    prefix: '/public/',
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Sivobor Blog API')
    .setVersion('1')
    .addBearerAuth()
    .addServer('http://localhost:8800')
    .addServer('https://api.sivobor.serbin.co')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document);
  await app.listen(8800);
}
bootstrap();

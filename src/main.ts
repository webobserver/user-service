import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as config from 'config';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}
process.env.NODE_CONFIG_DIR = '../config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('User microservice')
      .setDescription('User microservice for WebObserver')
      .setVersion('1.0')
      .addTag('user')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(config.PORT);
}
bootstrap();

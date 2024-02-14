import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Obach bghiti ngolhalik')
    .setDescription('had l project naaaaaaaaddiiiiiii')
    .setVersion('1.0')
    .build();

  app.enableCors({
    origin: 'http://127.0.0.1:3000/'
  });

  // Serve static files from the "public" directory
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT_BACK_END || 3333;
  
  app.use('/public', express.static('public'));

  await app.listen(port);
}

bootstrap();

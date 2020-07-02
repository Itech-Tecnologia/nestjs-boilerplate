import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { UI } from 'bull-board';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: { strategy: 'excludeAll' },
  });
  app.useGlobalPipes(validationPipe);

  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  if (configService.get('NODE_ENV') === 'development') app.use('/queue', UI);

  await app.listen(port);
}

bootstrap();

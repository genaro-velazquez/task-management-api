import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let app: INestApplication | null = null;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();
  }
  return app;
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server.getHttpAdapter().getInstance()(req, res);
};
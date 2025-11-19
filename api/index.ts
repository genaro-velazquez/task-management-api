import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as dns from 'dns';

// FORZAR IPv4 para Vercel
dns.setDefaultResultOrder('ipv4first');

export default async (req: any, res: any) => {
  try {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();
    
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error: unknown) {
    console.error('❌ Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: message
    });
  }
};
import * as dns from 'dns';

// FORZAR IPv4 ANTES DE TODO
dns.setDefaultResultOrder('ipv4first');

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

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
  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: String(err)
    });
  }
};
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * MAIN.TS - Punto de entrada de la aplicación
 */

async function bootstrap() {
  // Crear la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones desde tu app móvil
  app.enableCors({
    origin: '*', // En producción, especifica los dominios permitidos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades que no están en el DTO
    forbidNonWhitelisted: true, // Arroja error si hay propiedades extra
    transform: true, // Transforma los tipos automáticamente
  }));

  // Puerto de la aplicación
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  
  console.log(`🚀 API corriendo en http://localhost:${port}`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   - POST   /users`);
  console.log(`   - GET    /users`);
  console.log(`   - GET    /users/:id`);
  console.log(`   - DELETE /users/:id`);
  console.log(`   - POST   /tasks`);
  console.log(`   - GET    /tasks`);
  console.log(`   - GET    /tasks/analytics`);
  console.log(`   - GET    /tasks/:id`);
  console.log(`   - PUT    /tasks/:id`);
  console.log(`   - DELETE /tasks/:id`);
}

bootstrap();

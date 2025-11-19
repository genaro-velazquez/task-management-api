import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
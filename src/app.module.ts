import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

/**
 * APP MODULE
 * 
 * Módulo raíz de la aplicación
 * Importa y conecta todos los demás módulos
 */

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles en toda la app
      envFilePath: '.env',
    }),
    // Módulo de base de datos
    DatabaseModule,
    // Módulos de funcionalidad
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}

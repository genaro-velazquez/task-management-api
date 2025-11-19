import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        
        // DEBUG TEMPORAL
        console.log('🔍 DATABASE_URL from env:', dbUrl);
        console.log('🔍 process.env.DATABASE_URL:', process.env.DATABASE_URL);
        
        // Extraer el puerto para verificar
        const port = dbUrl?.match(/:(\d+)\//)?.[1];
        console.log('🔍 Port detected:', port);
        
        return {
          type: 'postgres',
          url: dbUrl,
          entities: [User, Task],
          synchronize: true,
          logging: true, // Ver todas las queries
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

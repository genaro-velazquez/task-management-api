import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

/**
 * USERS MODULE
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Registra la entidad User
  ],
  controllers: [UsersController], // Registra el controlador
  providers: [UsersService], // Registra el servicio
  exports: [UsersService], // Exporta el servicio para usarlo en otros módulos
})
export class UsersModule {}

import { Controller, Get, Post, Delete, Body, Param, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

/**
 * USERS CONTROLLER
 * 
 * Analogía Mobile:
 * - Es como definir tus rutas o endpoints en tu servidor
 * - Cada método es un endpoint que tu app iOS/Android puede llamar
 * 
 * @Controller('users') significa que todas las rutas empiezan con /users
 */

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Crear un nuevo usuario
   */
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Listar todos los usuarios con filtros opcionales
   * 
   * Ejemplos:
   * GET /users
   * GET /users?nombre=Juan
   * GET /users?rol=administrador
   * GET /users?email=juan@example.com&rol=miembro
   */
  @Get()
  findAll(@Query(ValidationPipe) filters: FilterUserDto) {
    return this.usersService.findAll(filters);
  }

  /**
   * GET /users/:id
   * Obtener un usuario específico por ID
   * 
   * Ejemplo: GET /users/123e4567-e89b-12d3-a456-426614174000
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * DELETE /users/:id
   * Eliminar un usuario
   * 
   * Ejemplo: DELETE /users/123e4567-e89b-12d3-a456-426614174000
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

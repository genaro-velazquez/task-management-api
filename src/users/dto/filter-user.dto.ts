import { IsOptional, IsString, IsEnum } from 'class-validator';

/**
 * FILTER USER DTO
 * 
 * Para filtrar usuarios en GET /users
 * Todos los campos son opcionales (query parameters)
 * 
 * Ejemplo: GET /users?nombre=Juan&rol=administrador
 */

export class FilterUserDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(['miembro', 'administrador'])
  rol?: 'miembro' | 'administrador';
}

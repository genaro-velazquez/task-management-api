import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * CREATE USER DTO
 */

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(100)
  email: string;

  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsEnum(['miembro', 'administrador'], { 
    message: 'El rol debe ser "miembro" o "administrador"' 
  })
  rol: 'miembro' | 'administrador';
}

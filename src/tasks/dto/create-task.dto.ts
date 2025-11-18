import { IsNotEmpty, IsString, IsNumber, IsDateString, IsEnum, IsArray, IsUUID, MaxLength, Min } from 'class-validator';

/**
 * CREATE TASK DTO
 * 
 * Validación para crear nuevas tareas
 */

export class CreateTaskDto {
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @MaxLength(1000)
  descripcion: string;

  @IsNotEmpty({ message: 'La estimación de horas es requerida' })
  @IsNumber({}, { message: 'La estimación debe ser un número' })
  @Min(0, { message: 'La estimación debe ser mayor o igual a 0' })
  estimacionHoras: number;

  @IsNotEmpty({ message: 'La fecha de vencimiento es requerida' })
  @IsDateString({}, { message: 'La fecha debe estar en formato ISO 8601' })
  fechaVencimiento: string;

  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsEnum(['activa', 'terminada'], { 
    message: 'El estado debe ser "activa" o "terminada"' 
  })
  estado: 'activa' | 'terminada';

  @IsNotEmpty({ message: 'El costo monetario es requerido' })
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @Min(0, { message: 'El costo debe ser mayor o igual a 0' })
  costoMonetario: number;

  @IsNotEmpty({ message: 'Los usuarios asignados son requeridos' })
  @IsArray({ message: 'Los usuarios asignados deben ser un array' })
  @IsUUID('4', { each: true, message: 'Cada ID de usuario debe ser un UUID válido' })
  assignedUserIds: string[];
}

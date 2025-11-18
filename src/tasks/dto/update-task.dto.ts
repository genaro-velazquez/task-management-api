import { IsOptional, IsString, IsNumber, IsDateString, IsEnum, IsArray, IsUUID, MaxLength, Min } from 'class-validator';

/**
 * UPDATE TASK DTO
 * 
 * Para actualizar tareas existentes
 * Todos los campos son opcionales (solo actualizas lo que necesitas)
 */

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimacionHoras?: number;

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsEnum(['activa', 'terminada'])
  estado?: 'activa' | 'terminada';

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoMonetario?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assignedUserIds?: string[];
}

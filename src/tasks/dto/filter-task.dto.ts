import { IsOptional, IsString, IsDateString, IsUUID, IsEnum } from 'class-validator';

/**
 * FILTER TASK DTO
 * 
 * Para filtrar tareas en GET /tasks
 * Ejemplo: GET /tasks?estado=activa&orderBy=desc&usuarioAsignado=uuid-123
 */

export class FilterTaskDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsUUID('4')
  usuarioAsignado?: string;

  @IsOptional()
  @IsString()
  nombreUsuario?: string;

  @IsOptional()
  @IsString()
  emailUsuario?: string;

  @IsOptional()
  @IsEnum(['activa', 'terminada'])
  estado?: 'activa' | 'terminada';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';
}

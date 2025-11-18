import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

/**
 * TASKS CONTROLLER
 * Endpoints para gestión de tareas
 */

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * POST /tasks
   * Crear una nueva tarea
   */
  @Post()
  create(@Body(ValidationPipe) createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * GET /tasks
   * Listar tareas con filtros y ordenamiento
   * 
   * Ejemplos:
   * GET /tasks
   * GET /tasks?estado=activa
   * GET /tasks?orderBy=desc
   * GET /tasks?titulo=Diseño&usuarioAsignado=uuid-123
   * GET /tasks?nombreUsuario=Juan&emailUsuario=juan@example.com
   */
  @Get()
  findAll(@Query(ValidationPipe) filters: FilterTaskDto) {
    return this.tasksService.findAll(filters);
  }

  /**
   * GET /tasks/analytics
   * Obtener estadísticas de tareas
   * IMPORTANTE: Este endpoint debe estar ANTES de /tasks/:id
   * para que no confunda "analytics" con un ID
   */
  @Get('analytics')
  getAnalytics() {
    return this.tasksService.getAnalytics();
  }

  /**
   * GET /tasks/:id
   * Obtener una tarea específica
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  /**
   * PUT /tasks/:id
   * Actualizar una tarea completa o parcialmente
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  /**
   * DELETE /tasks/:id
   * Eliminar una tarea
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Buscar usuarios asignados
    const users = await this.usersRepository.findBy({
      id: In(createTaskDto.assignedUserIds)
    });

    if (users.length !== createTaskDto.assignedUserIds.length) {
      throw new BadRequestException('Uno o más usuarios no existen');
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      assignedUsers: users,
      fechaVencimiento: new Date(createTaskDto.fechaVencimiento),
    });

    return await this.tasksRepository.save(task);
  }

  async findAll(filters: FilterTaskDto) {
    const queryBuilder = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUsers', 'user');

    // Filtro por título
    if (filters.titulo) {
      queryBuilder.andWhere('task.titulo ILIKE :titulo', { 
        titulo: `%${filters.titulo}%` 
      });
    }

    // Filtro por fecha de vencimiento
    if (filters.fechaVencimiento) {
      console.log('🔍 Fecha recibida:', filters.fechaVencimiento);
      
      const fecha = new Date(filters.fechaVencimiento);
      const fechaInicio = new Date(fecha);
      fechaInicio.setUTCHours(0, 0, 0, 0);
      
      const fechaFin = new Date(fecha);
      fechaFin.setUTCHours(23, 59, 59, 999);
      
      console.log('🔍 fechaInicio:', fechaInicio);
      console.log('🔍 fechaFin:', fechaFin);
      console.log('🔍 Aplicando filtro de fecha...');
      
      queryBuilder.andWhere(
        'task.fechaVencimiento >= :fechaInicio AND task.fechaVencimiento <= :fechaFin',
        { fechaInicio, fechaFin }
      );
      
      console.log('🔍 Filtro aplicado');
    }

    // Filtro por estado
    if (filters.estado) {
      queryBuilder.andWhere('task.estado = :estado', { estado: filters.estado });
    }

    // Filtro por usuario asignado (ID)
    if (filters.usuarioAsignado) {
      queryBuilder.andWhere('user.id = :userId', { userId: filters.usuarioAsignado });
    }

    // Filtro por nombre de usuario
    if (filters.nombreUsuario) {
      queryBuilder.andWhere('user.nombre ILIKE :nombre', { 
        nombre: `%${filters.nombreUsuario}%` 
      });
    }

    // Filtro por email de usuario
    if (filters.emailUsuario) {
      queryBuilder.andWhere('user.email ILIKE :email', { 
        email: `%${filters.emailUsuario}%` 
      });
    }

    // Ordenamiento (más reciente a menos reciente por defecto)
    const order = filters.orderBy === 'asc' ? 'ASC' : 'DESC';
    queryBuilder.orderBy('task.createdAt', order);

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedUsers'],
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    // Si se actualizan los usuarios asignados
    if (updateTaskDto.assignedUserIds) {
      const users = await this.usersRepository.findBy({
        id: In(updateTaskDto.assignedUserIds)
      });

      if (users.length !== updateTaskDto.assignedUserIds.length) {
        throw new BadRequestException('Uno o más usuarios no existen');
      }

      task.assignedUsers = users;
    }

    // Actualizar otros campos
    Object.assign(task, {
      ...updateTaskDto,
      fechaVencimiento: updateTaskDto.fechaVencimiento 
        ? new Date(updateTaskDto.fechaVencimiento) 
        : task.fechaVencimiento,
    });

    return await this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }

  /**
   * ENDPOINT DE ANALÍTICA
   * Retorna estadísticas relevantes
   */
  async getAnalytics() {
    const allTasks = await this.tasksRepository.find({
      relations: ['assignedUsers'],
    });

    // Estadística 1: Tareas por estado
    const tareasActivas = allTasks.filter(t => t.estado === 'activa').length;
    const tareasTerminadas = allTasks.filter(t => t.estado === 'terminada').length;

    // Estadística 2: Costo total de tareas terminadas
    const costoTotalTerminadas = allTasks
      .filter(t => t.estado === 'terminada')
      .reduce((sum, task) => sum + Number(task.costoMonetario), 0);

    // Estadística 3: Promedio de horas estimadas por tarea
    const promedioHoras = allTasks.length > 0
      ? allTasks.reduce((sum, task) => sum + Number(task.estimacionHoras), 0) / allTasks.length
      : 0;

    // Estadística 4: Tareas próximas a vencer (en los próximos 7 días)
    const hoy = new Date();
    const enSieteDias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    const tareasProximasVencer = allTasks.filter(t => {
      const fechaVenc = new Date(t.fechaVencimiento);
      return t.estado === 'activa' && fechaVenc >= hoy && fechaVenc <= enSieteDias;
    }).length;

    return {
      totalTareas: allTasks.length,
      tareasActivas,
      tareasTerminadas,
      costoTotalTerminadas: parseFloat(costoTotalTerminadas.toFixed(2)),
      promedioHorasEstimadas: parseFloat(promedioHoras.toFixed(2)),
      tareasProximasVencer,
    };
  }
}

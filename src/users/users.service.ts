import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(filters: FilterUserDto) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'task');

    if (filters.nombre) {
      queryBuilder.andWhere('user.nombre ILIKE :nombre', { 
        nombre: `%${filters.nombre}%` 
      });
    }

    if (filters.email) {
      queryBuilder.andWhere('user.email ILIKE :email', { 
        email: `%${filters.email}%` 
      });
    }

    if (filters.rol) {
      queryBuilder.andWhere('user.rol = :rol', { rol: filters.rol });
    }

    const users = await queryBuilder.getMany();

    const usersWithStats = users.map(user => {
      const tareasTerminadas = user.tasks.filter(t => t.estado === 'terminada');
      const cantidadTareasTerminadas = tareasTerminadas.length;
      const sumaCostoTareasTerminadas = tareasTerminadas.reduce(
        (sum, task) => sum + Number(task.costoMonetario), 
        0
      );

      return {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        cantidadTareasTerminadas,
        sumaCostoTareasTerminadas: parseFloat(sumaCostoTareasTerminadas.toFixed(2)),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return usersWithStats;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}

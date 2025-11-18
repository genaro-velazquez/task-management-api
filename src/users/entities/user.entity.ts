import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

/**
 * ENTIDAD USER
 * Representa la tabla 'users' en PostgreSQL
 */

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    unique: true 
  })
  email: string;

  @Column({ 
    type: 'enum', 
    enum: ['miembro', 'administrador'],
    default: 'miembro'
  })
  rol: 'miembro' | 'administrador';

  /**
   * RELACIÓN MANY-TO-MANY
   * Un usuario puede tener muchas tareas y una tarea puede tener muchos usuarios
   */
  @ManyToMany(() => Task, (task) => task.assignedUsers)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

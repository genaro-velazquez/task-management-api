import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * ENTIDAD TASK
 * Representa la tabla 'tasks' en PostgreSQL
 */

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  estimacionHoras: number;

  @Column({ type: 'timestamp' })
  fechaVencimiento: Date;

  @Column({ 
    type: 'enum', 
    enum: ['activa', 'terminada'],
    default: 'activa'
  })
  estado: 'activa' | 'terminada';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costoMonetario: number;

  /**
   * RELACIÓN MANY-TO-MANY CON USUARIOS
   * @JoinTable crea la tabla intermedia task_users_user
   * 
   * Analogía:
   * - Como tener un array de usuarios: var assignedUsers: [User]
   * - Pero en la BD se guarda en una tabla separada con las relaciones
   */
  @ManyToMany(() => User, (user) => user.tasks, { eager: true })
  @JoinTable()
  assignedUsers: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

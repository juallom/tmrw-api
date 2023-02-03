import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './types';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: '100' })
  firstName: string;

  @Column({ length: '100', nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  hash: string;

  @Column({ enum: UserRole, default: UserRole.DEFAULT })
  role: UserRole;
}

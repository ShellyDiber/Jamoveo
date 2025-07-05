import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'player' | 'admin';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  instrument: string;

  @Column({ default: 'player' })
  role: UserRole;

}

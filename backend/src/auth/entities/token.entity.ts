import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryColumn()
  hashedToken!: string;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  created!: Date;

  @Column({ type: 'timestamptz' })
  expiry!: Date;
}

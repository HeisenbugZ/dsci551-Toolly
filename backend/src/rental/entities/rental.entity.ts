import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tool } from 'src/tools/entities/tool.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column()
  @ApiProperty()
  note!: string;

  @Column({
    type: String,
    default: '',
  })
  @ApiProperty()
  status!: RentalStatus;

  @ManyToOne(() => Tool)
  @ApiProperty()
  tool!: Tool;

  @ManyToOne(() => User)
  @ApiProperty()
  initiator!: User;

  @ManyToOne(() => User)
  @ApiProperty()
  lender!: User;

  @ManyToOne(() => User)
  @ApiProperty()
  renter!: User;

  @CreateDateColumn()
  @ApiProperty()
  created!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiPropertyOptional({
    type: Date,
  })
  expectedDelivery!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiPropertyOptional({
    type: Date,
  })
  actualDelivery!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiPropertyOptional({
    type: Date,
  })
  expectedReturn!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiPropertyOptional({
    type: Date,
  })
  actualReturn!: Date | null;
}

export type RentalStatus =
  | 'await_confirmation'
  | 'confirmed'
  | 'delivered'
  | 'returned'
  | 'cancelled';

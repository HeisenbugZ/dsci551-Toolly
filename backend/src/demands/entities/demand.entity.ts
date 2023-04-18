import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Demand {
  @Column()
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @Column()
  @ApiProperty()
  title!: string;

  @Column()
  @ApiProperty()
  description!: string;

  @CreateDateColumn()
  @ApiProperty()
  created!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated!: Date;

  @ManyToOne(() => User)
  @ApiProperty()
  creator!: User;

  @ManyToMany(() => Category)
  @JoinTable()
  @ApiPropertyOptional({
    type: () => [Category],
  })
  categories!: Category[];
}

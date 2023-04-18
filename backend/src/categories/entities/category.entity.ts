import { User } from 'src/users/entities/user.entity';
import { File } from 'src/files/entities/file.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tool } from 'src/tools/entities/tool.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ unique: true })
  name!: string;

  @ApiPropertyOptional({
    type: [File],
  })
  @ManyToMany(() => File)
  @JoinTable()
  photos!: File[];

  @ApiPropertyOptional({
    type: [Tool],
  })
  @ManyToMany(() => Tool, (tool) => tool.categories)
  tools!: Tool[];

  @ApiProperty()
  @ManyToOne(() => User)
  createdBy!: User;

  @ApiProperty()
  @CreateDateColumn()
  created!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated!: Date;

  @ApiProperty()
  @Column({ default: '' })
  group!: string;
}

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
import { Category } from 'src/categories/entities/category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Entity()
export class Tool {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id!: number;

  @ManyToOne(() => User)
  @ApiPropertyOptional()
  user!: User;

  @Column()
  @ApiProperty()
  name!: string;

  @Column()
  @ApiProperty()
  introduction!: string;

  @ManyToMany(() => File)
  @JoinTable()
  @ApiPropertyOptional({
    type: () => [File],
  })
  @Transform(({ value }: { value: File[] }) =>
    value.sort((a, b) => a.created.getTime() - b.created.getTime()),
  )
  photos!: File[];
  // This is many-to-many because files of the same content are exactly the same entity

  @CreateDateColumn()
  @ApiProperty()
  created!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated!: Date;

  @ManyToMany(() => Category, (category) => category.tools)
  @JoinTable()
  @ApiPropertyOptional({
    type: () => [Category],
  })
  categories!: Category[];
}

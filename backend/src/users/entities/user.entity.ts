import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { File } from 'src/files/entities/file.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty()
  @Column({ unique: true })
  email!: string;

  @ApiProperty()
  @Column({ default: '00000' })
  zipcode!: string;

  @ApiProperty()
  @Column()
  address!: string;

  @ApiProperty()
  @Column('float8', { default: 0 })
  latitude!: number;

  @ApiProperty()
  @Column('float8', { default: 0 })
  longitude!: number;

  @Column()
  @Exclude()
  hashedPassword!: string;

  @ApiProperty()
  @CreateDateColumn()
  created!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated!: Date;

  @ApiPropertyOptional({
    type: () => File,
  })
  @ManyToOne(() => File)
  profilePhoto?: File;
  // This is many-to-one because files of the same content are exactly the same entity,
  // i.e. the same photo might have multiple users.

  @ApiProperty()
  @Column({
    type: String,
    default: 'client',
  })
  role!: Role;
}

export type Role = 'client' | 'admin';

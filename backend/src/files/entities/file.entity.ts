import { User } from 'src/users/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class File {
  @ApiProperty()
  @PrimaryColumn()
  url!: string;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty()
  @Column()
  mimeType!: string;

  @ApiPropertyOptional({
    type: () => User,
  })
  @ManyToOne(() => User)
  createdBy?: User;

  @ApiProperty()
  @CreateDateColumn()
  created!: Date;
}

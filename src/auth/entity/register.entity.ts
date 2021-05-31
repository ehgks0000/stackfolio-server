import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Unique,
} from 'typeorm';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { nanoid } from 'nanoid';
import { Provider } from 'src/users/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['email'])
export class Register {
  /** Columns */

  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @ApiProperty({ readOnly: true })
  @Column({ length: 10 })
  @IsString()
  code: string;

  @ApiProperty({ required: false })
  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  @IsEnum(Provider)
  @IsOptional()
  provider?: Provider;

  @ApiProperty({ required: false })
  @Column({ length: 255, nullable: true })
  @IsString()
  social_id?: string;

  @ApiProperty()
  @Column({ length: 255 })
  @IsEmail()
  email: string;

  /** Listener */

  @BeforeInsert()
  generateVerificationCode(): void {
    this.code = nanoid(10);
  }
}

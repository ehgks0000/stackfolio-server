import { User } from 'src/users/entity/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { IsString, IsUUID } from 'class-validator';
import { nanoid } from 'nanoid';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Verification {
  /** Columns */

  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @ApiProperty({ readOnly: true })
  @Column({ length: 255 })
  @IsString()
  code: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  user_id: string;

  /** Relations */

  @OneToOne((type) => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  /** Listeners */

  @BeforeInsert()
  generateVerificationCode(): void {
    this.code = this.user.email + '-' + nanoid(10);
  }
}

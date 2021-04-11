import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class QuestionComment {
  /** Columns */
  // @ApiProperty({ required: false })
  // @ApiProperty({ readOnly: true })

  @PrimaryGeneratedColumn()
  readonly id: number;

  @ApiProperty({ required: false })
  @Column({ default: 1 })
  @IsOptional()
  group?: number;

  @ApiProperty({ required: false })
  @Column({ default: 0 })
  @IsOptional()
  sorts?: number;

  @ApiProperty({ required: false })
  @Column({ default: 0 })
  @IsOptional()
  depth?: number;

  @ApiProperty()
  @Column('text')
  @IsString()
  contents: string;

  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  readonly updated_at: Date;

  @Column('timestamptz')
  @DeleteDateColumn()
  readonly deleted_at: Date;

  // @Column({ default: false })
  // @IsBoolean()
  // @IsOptional()
  // deleted: boolean;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  user_id: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  question_id: string;

  /** Relations */

  @ManyToOne((type) => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne((type) => Question, (question) => question.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id', referencedColumnName: 'id' })
  question: Question;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { IsBoolean, IsOptional } from 'class-validator';
import { Question } from './question.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class QuestionMetadata {
  /** Columns */

  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  // @ApiProperty({ required: false })
  // @ApiProperty({ readOnly: true })
  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @UpdateDateColumn()
  published_at: Date;

  @ApiProperty({ required: false })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  published: boolean;

  @ApiProperty({ required: false })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  is_private: boolean;

  /** Relations */

  @OneToOne((type) => Question, (question) => question.metadata, {
    onDelete: 'CASCADE',
  })
  question: Question;
}

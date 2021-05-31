import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Post } from './post.entity';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PostMetadata {
  /** Columns */

  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @UpdateDateColumn()
  published_at: Date;

  @ApiProperty({ required: false })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({ required: false })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  is_private?: boolean;

  /** Relations */

  @OneToOne((type) => Post, (post) => post.metadata, { onDelete: 'CASCADE' })
  post: Post;
}

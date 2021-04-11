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
import { Post } from './post.entity';

@Entity()
export class PostComment {
  /** Columns */

  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

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
  @DeleteDateColumn()
  readonly deleted_at: Date;

  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  readonly updated_at: Date;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  user_id: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  post_id: string;

  /** Relations */

  @ManyToOne((type) => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne((type) => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;
}

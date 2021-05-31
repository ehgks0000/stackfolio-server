import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostComment {
  /** Columns */

  @ApiProperty({ readOnly: true })
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

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @DeleteDateColumn()
  readonly deleted_at: Date;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @UpdateDateColumn()
  readonly updated_at: Date;

  /** Relations IDs*/

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  user_id: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  post_id: string;

  @ApiProperty({ readOnly: true })
  @RelationId((self: PostComment) => self.user_like)
  user_like_ids: string[];

  /** Relations */
  @ManyToOne((type) => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne((type) => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToMany((type) => User, (user_like) => user_like.post_comment_like, {
    cascade: true,
  })
  //   @JoinTable({ name: 'comment_like' })
  user_like: User[];
}

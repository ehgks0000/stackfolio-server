import { MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from 'src/posts/entity/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tag {
  /** Columns */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @UpdateDateColumn()
  readonly updated_at: Date;

  // @ApiProperty({ required: false })
  @ApiProperty({ readOnly: true, required: true })
  @Column({ length: 255 })
  @MinLength(2)
  title!: string;

  /** Relations */
  @ApiProperty({ readOnly: true })
  @RelationId((self: Tag) => self.posts)
  post_id: string[];

  @ManyToMany((type) => Post, (posts) => posts.tags, { cascade: true })
  posts: Post[];

  //   @ManyToMany((type) => Question, (questions) => questions.tags)
  //   questions: Question[];
}

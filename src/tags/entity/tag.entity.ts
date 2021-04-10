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

@Entity()
export class Tag {
  /** Columns */

  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  readonly updated_at: Date;

  @Column({ length: 255 })
  @MinLength(2)
  title: string;

  /** Relations */
  @RelationId((self: Tag) => self.posts)
  post_id: string[];

  @ManyToMany((type) => Post, (posts) => posts.tags)
  posts: Post[];

  //   @ManyToMany((type) => Question, (questions) => questions.tags)
  //   questions: Question[];
}

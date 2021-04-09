import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Post } from 'src/posts/entity/post.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
// import { Series_posts } from './series_post.entity';

@Entity()
export class Series {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @Column('timestamptz')
  @CreateDateColumn()
  readonly updated_at: Date;

  @Column()
  @IsString()
  //   @Index({ unique: true })
  name: string;

  @Column({ nullable: true })
  @IsString()
  description?: string;

  @Column({ nullable: true })
  @IsString()
  thumbnail?: string;

  @Column({ nullable: true })
  @IsString()
  slug?: string;

  @Column('uuid')
  @IsUUID('4')
  user_id!: string;

  //   @Column('uuid', { nullable: true, array: true })
  //   @IsUUID('4')
  //   post_id!: string[];

  @RelationId((self: Series) => self.posts)
  post_id: string[];

  @ManyToOne(() => User, (user) => user.series)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Post, (posts) => posts.series)
  @JoinColumn({ name: 'post_id' })
  posts: Post[];
}

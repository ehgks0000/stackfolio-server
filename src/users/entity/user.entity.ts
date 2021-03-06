import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
  Check,
  ManyToMany,
  JoinTable,
  OneToOne,
  AfterLoad,
  AfterInsert,
  JoinColumn,
  RelationId,
} from 'typeorm';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsBoolean,
} from 'class-validator';

import { Post } from '../../posts/entity/post.entity';
import { UserProfile } from './user-profile.entity';
import { PostComment } from 'src/posts/entity/post-comment.entity';
import { Favorite } from './user-favorite.entity';
import { Series } from 'src/series/entity/series.entity';
import { Question } from 'src/question/entity/question.entity';
import { QuestionComment } from 'src/question/entity/question-comment.entity';

export enum Provider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Entity()
@Unique(['email'])
@Check(`
  COALESCE((provider = 'local')::integer, 0) 
  + 
  COALESCE(LENGTH(social_id::text)::boolean::integer, 0)
  = 1
`)
export class User {
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

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  @IsEnum(Provider)
  @IsOptional()
  provider: Provider;

  @ApiProperty()
  @Column({ length: 255, nullable: true })
  @IsString()
  social_id?: string;

  @ApiProperty()
  @Column({ length: 255 })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  is_verified: boolean;

  /** Relations ID*/
  @ApiProperty({ readOnly: true })
  @RelationId((self: User) => self.posts)
  post_id: string[];

  @ApiProperty({ readOnly: true })
  @RelationId((self: User) => self.post_like)
  post_like_ids: string[];

  @ApiProperty({ readOnly: true })
  @RelationId((self: User) => self.question_like)
  question_like_ids: string[];

  /** Relations */

  @OneToMany((type) => Post, (post) => post.author)
  //   @JoinColumn({ name: 'post_count', referencedColumnName: '' })
  posts: Post[];

  @OneToMany((type) => Question, (question) => question.author)
  questions: Question[];

  // postcomments??? questioncomments 2?????? ????????????????
  @OneToMany((type) => PostComment, (comment) => comment.user)
  comments: Comment[];

  @ApiProperty()
  @OneToOne((type) => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
    // eager: true,
  })
  profile: UserProfile;

  @OneToMany((type) => Favorite, (favorites) => favorites.user, {
    cascade: true,
  })
  favorites!: Favorite[];

  @OneToMany((type) => Series, (series) => series.user)
  series: Series[];

  @ManyToMany((type) => User, (user) => user.following, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'follow',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'follower_id', referencedColumnName: 'id' },
  })
  followers: User[];

  @ManyToMany((type) => User, (user) => user.followers, { onDelete: 'CASCADE' })
  following: User[];

  //?????? ????????? ??? ?????????
  @ManyToMany((type) => Post, (post_like) => post_like.user_like)
  @JoinTable({
    name: 'post_like',
    joinColumn: { name: 'post_like_ids', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_like_ids', referencedColumnName: 'id' },
  })
  post_like: Post[];

  // ?????? ????????? ??? ?????????
  @ManyToMany((type) => Question, (question_like) => question_like.user_like)
  @JoinTable({
    name: 'question_like',
  })
  question_like: Question[];

  //?????? ???????????? ??????(?????????)
  @ManyToMany(
    (type) => PostComment,
    (post_comment_like) => post_comment_like.user_like,
  )
  @JoinTable({ name: 'post_comment_like' })
  post_comment_like: PostComment[];

  //?????? ???????????? ??????(?????????)
  @ManyToMany(
    (type) => QuestionComment,
    (question_comment_like) => question_comment_like.user_like,
  )
  @JoinTable({ name: 'question_comment_like' })
  question_comment_like: QuestionComment[];
}

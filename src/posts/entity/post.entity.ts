import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { User } from '../../users/entity/user.entity';
import { PostInformation } from './post-information.entity';
import { PostMetadata } from './post-metadata.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { PostComment } from './post-comment.entity';
import { Favorite } from 'src/users/entity/user-favorite.entity';
import { Series } from 'src/series/entity/series.entity';
import { ApiProperty } from '@nestjs/swagger';
// import { Post_tag } from 'src/tags/entity/post_tag.entity';
// import { PostLike } from './post-like.entity';
// import { Series_posts } from 'src/series/entity/series_post.entity';

@Entity()
export class Post {
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
  // @ApiProperty({ readOnly: true })

  @ApiProperty()
  @Column({ length: 255 })
  @IsString()
  title: string;

  @ApiProperty()
  @Column('text')
  @IsString()
  contents: string;

  //   @ApiProperty({ description: '전체 조회수 기능입니다.' })
  //   @Column({ default: 0 })
  //   total_view_count: number;

  //   @ApiProperty({ description: '일주일 조회수 기능입니다.' })
  //   @Column({ default: 0 })
  //   weekly_view_count: number;
  /* 
    @todo 
    댓글 수를 유저 엔티티에서 어떻게 불러올수있을까
  */
  @ApiProperty({ readOnly: true })
  @Column({ default: 0 })
  comment_count: number;

  /** Relations ID*/

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  user_id: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  post_information_id: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  post_metadata_id: string;

  @ApiProperty({ readOnly: true })
  @RelationId((self: Post) => self.tags)
  tag_id: string[];

  //   @Column((self: Post) => self.tags)
  //   tag_name: string[];

  @ApiProperty({ readOnly: true })
  @Column('uuid', { nullable: true })
  @IsUUID('4')
  series_id?: string;

  //   @ApiProperty({ readOnly: true })
  //   @Column('uuid', { nullable: true })
  @ApiProperty({ readOnly: true })
  @RelationId((self: Post) => self.user_like)
  @IsUUID('4')
  user_like_ids?: string[];

  /** Relations */

  @ApiProperty({ readOnly: true })
  @OneToOne((type) => PostInformation, (information) => information.post, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'post_information_id', referencedColumnName: 'id' })
  information?: PostInformation;

  @ApiProperty({ readOnly: true })
  @OneToOne((type) => PostMetadata, (metadata) => metadata.post, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'post_metadata_id', referencedColumnName: 'id' })
  metadata: PostMetadata;

  @ApiProperty({ readOnly: true })
  @OneToMany((type) => PostComment, (comment) => comment.post)
  comments: PostComment[];

  @ApiProperty({ readOnly: true })
  @OneToMany((type) => Favorite, (favorites) => favorites.post)
  favorites!: Favorite[];

  //   @ApiProperty({ readOnly: true })
  @ManyToOne((type) => User, (user) => user.posts, {
    cascade: true,
    // eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  author: User;

  //   @ManyToMany((type) => User, (user) => user.favorites)
  //   users: User[];

  @ApiProperty({ readOnly: true })
  @ManyToOne(() => Series, (series) => series.posts, { nullable: true })
  @JoinColumn({ name: 'series_id', referencedColumnName: 'id' })
  series: Series;

  @ApiProperty({ readOnly: true })
  @ManyToMany((type) => Tag, (tags) => tags.posts)
  @JoinTable({
    name: 'post_tag',
    // joinColumn: { name: 'tag_name', referencedColumnName: 'title' },
    // inverseJoinColumn: { name: 'tag_name', referencedColumnName: 'title' },
  })
  tags?: Tag[];

  @ApiProperty({ readOnly: true })
  @ManyToMany((type) => User, (user_like) => user_like.post_like, {
    cascade: true,
  })
  user_like?: User[];
  //게시글을 좋아요 한 유저들
}

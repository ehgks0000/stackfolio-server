import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Unique,
  OneToMany,
  BeforeUpdate,
  AfterLoad,
  RelationId,
  EventSubscriber,
} from 'typeorm';
import { User } from './user.entity';
import {
  IsString,
  IsOptional,
  Length,
  IsObject,
  IsUUID,
} from 'class-validator';
import { UserInterest } from './user-interest.entity';

export class SocialLinks {
  @ApiProperty({ required: false })
  email?: string;
  @ApiProperty({ required: false })
  github?: string;
  @ApiProperty({ required: false })
  linkedIn?: string;
  @ApiProperty({ required: false })
  twitter?: string;
  @ApiProperty({ required: false })
  facebook?: string;
  @ApiProperty({ required: false })
  homepage?: string;
}

@Entity()
@Unique(['username'])
export class UserProfile {
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
  @Column({ length: 255 })
  @IsString()
  @Length(3, 50)
  username: string;

  @ApiProperty({ required: false })
  @Column({ length: 255, nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false })
  @Column('text', { nullable: true })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ required: false })
  @Column({ length: 255, nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'jsonb', default: {} })
  @IsObject()
  @IsOptional()
  social_links?: SocialLinks;

  //   @ApiProperty({ readOnly: true })
  //   @IsUUID('4')
  //   @RelationId((self: UserProfile) => self.user)
  //   user_id: string;

  @ApiProperty({ readOnly: true })
  @Column({ default: 0 })
  post_count: number;
  //   @RelationId((self: User) => self.posts)
  //   post_count: number;
  @ApiProperty({ readOnly: true })
  @Column({ default: 0, nullable: true })
  @IsOptional()
  exp?: number;

  //   //   @BeforeUpdate()
  @ApiProperty({ readOnly: true })
  @Column({ default: 1, nullable: true })
  @IsOptional()
  level?: number;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  user_id: string;

  //   @ApiProperty({ readOnly: true })
  //   @Column({ default: 0 })
  //   post_count?: number;

  /** Relations */
  @OneToOne((type) => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  // @ApiProperty({ type: [UserInterest] })
  // @OneToMany((type) => UserInterest, (userInterest) => userInterest.profile, {
  //   cascade: true,
  //   eager: true,
  // })
  // interests: UserInterest[];

  // ** Hooks

  //   @AfterLoad()
  //   updatePostCount() {
  //     this.post_count = this.user.posts.length;
  //     console.log('유저프로필 entity : 유저', this.user);
  //     console.log('유저프로필 entity : 유저 게시글', this.user.posts);
  //     console.log('유저프로필 entity : 유저 게시글 수', this.user.posts.length);
  //   }

  //   @AfterLoad()
  //   updateExp() {
  //     let count = 0;
  //     this.user.posts.forEach((post) => {
  //       count += post.comments.length;
  //     });
  //     this.exp = this.post_count;
  //   }

  //   @AfterLoad()
  //   updateLevel() {
  //     if (this.exp <= 50) {
  //       this.level = 1;
  //     } else if (this.exp <= 100) {
  //       this.level = 2;
  //     } else {
  //       this.level = 3;
  //     }
  //   }
}

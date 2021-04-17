import { IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from 'src/posts/entity/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Favorite {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  user_id!: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  post_id!: string;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Post, (post) => post.favorites)
  @JoinColumn({ name: 'post_id' })
  post!: Post;
}

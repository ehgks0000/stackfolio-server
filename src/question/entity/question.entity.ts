import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { QuestionComment } from './question-comment.entity';
import { QuestionInformation } from './question-information.entity';
import { QuestionMetadata } from './question-metadata.entity';

@Entity()
export class Question {
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly created_at: Date;

  @ApiProperty({ readOnly: true })
  @Column('timestamptz')
  @CreateDateColumn()
  readonly updated_at: Date;

  // @ApiProperty({ required: false })
  // @ApiProperty({ readOnly: true })
  @ApiProperty()
  @Column('text')
  @IsString()
  title: string;

  @ApiProperty()
  @Column('text')
  @IsString()
  contents: string;

  @ApiProperty({ readOnly: true })
  @Column({ default: 0 })
  comment_count: number;

  /** Relation ID */

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  user_id: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  question_information_id: string;

  @ApiProperty({ readOnly: true })
  @Column('uuid')
  @IsUUID('4')
  question_metadata_id: string;

  @ApiProperty({ readOnly: true })
  @RelationId((self: Question) => self.user_like)
  user_like_ids: string[];

  /** Relation */
  @OneToOne(
    (type) => QuestionInformation,
    (information) => information.question,
    {
      cascade: true,
      eager: true,
    },
  )
  @JoinColumn({ name: 'question_information_id', referencedColumnName: 'id' })
  information?: QuestionInformation;

  @OneToOne((type) => QuestionMetadata, (metadata) => metadata.question, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'question_metadata_id', referencedColumnName: 'id' })
  metadata: QuestionMetadata;

  @ManyToOne((type) => User, (user) => user.questions, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  author: User;

  //   @OneToMany((type) => QuestionLike, (likes) => likes.question_id)
  //   likes: QuestionLike[];

  @OneToMany((type) => QuestionComment, (comments) => comments.question)
  comments: QuestionComment[];

  @ManyToMany((type) => User, (user_like) => user_like.question_like, {
    cascade: true,
  })
  user_like: User[];
}

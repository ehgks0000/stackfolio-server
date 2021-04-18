import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Verification } from '../auth/entity/verification.entity';
import { Register } from '../auth/entity/register.entity';
import { Post } from '../posts/entity/post.entity';
import { User } from '../users/entity/user.entity';
import { UserProfile } from '../users/entity/user-profile.entity';
import { PostMetadata } from '../posts/entity/post-metadata.entity';
import { PostInformation } from '../posts/entity/post-information.entity';
// import { PostLike } from 'src/posts/entity/post-like.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { PostComment } from 'src/posts/entity/post-comment.entity';
import { Favorite } from 'src/users/entity/user-favorite.entity';
// import { Series_posts } from 'src/series/entity/series_post.entity';
import { Series } from 'src/series/entity/series.entity';
import { Question } from 'src/question/entity/question.entity';
import { QuestionComment } from 'src/question/entity/question-comment.entity';
import { QuestionInformation } from 'src/question/entity/question-information.entity';
import { QuestionMetadata } from 'src/question/entity/question-metadata.entity';
import { UserInterest } from 'src/users/entity/user-interest.entity';

const inContainer = JSON.parse(process.env.IN_CONTAINER);
// const inContainer = Boolean(process.env.IN_CONTAINER);
const isDev = process.env.NODE_ENV === 'development';

const entities = [
  Verification,
  Register,
  User,
  UserProfile,
  UserInterest,
  Favorite,
  Series,
  //   Series_posts,
  Question,
  QuestionComment,
  QuestionInformation,
  QuestionMetadata,
  Post,
  PostMetadata,
  PostInformation,
  PostComment,
  Tag,
];

/**
 * TypeORM connection options
 * @constant
 * @type {TypeOrmModuleOptions}
 * @description Sets the connection options based on current enviroment
 */
export const typeOrmConfig: TypeOrmModuleOptions = inContainer
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: isDev,
      logging: isDev,
      entities,
    }
  : {
      type: 'postgres',
      username: 'postgres',
      password: 'sdfasdfasdfasdf',
      port: 5432,
      host: '127.0.0.1',
      database: 'nest-typeorm',
      synchronize: true,
      entities, // Static glob paths (e.g., dist/**/*.entity{ .ts,.js}) has weird behaviors
    };

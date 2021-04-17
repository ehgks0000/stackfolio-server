import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { TagRepository } from 'src/tags/repository/tag.repository';
import { TagsService } from 'src/tags/tags.service';
import { Favorite } from 'src/users/entity/user-favorite.entity';
import { UserFavoriteRepository } from 'src/users/repository/user-favorite.repository';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { PostInformation } from './entity/post-information.entity';
import { PostMetadata } from './entity/post-metadata.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostCommentRepository } from './repository/post-comment.repository';
// import { PostLikeRepository } from './repository/post-like.repository';
import { PostRepository } from './repository/post.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      PostCommentRepository,
      //   PostLikeRepository,
      PostInformation,
      PostMetadata,
      Favorite,
      UserRepository,
      UserProfileRepository,
      UserFavoriteRepository,
      //   TagRepository,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, TagsService, TagRepository, FilesService],
  exports: [PostsService, TypeOrmModule],
})
export class PostsModule {}

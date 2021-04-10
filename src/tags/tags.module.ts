import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './repository/tag.repository';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PostRepository } from 'src/posts/repository/post.repository';
@Module({
  imports: [TypeOrmModule.forFeature([TagRepository, PostRepository])],
  exports: [],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}

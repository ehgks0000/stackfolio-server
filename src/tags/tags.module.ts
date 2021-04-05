import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './repository/tag.repository';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
@Module({
  imports: [TypeOrmModule.forFeature([TagRepository])],
  exports: [],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}

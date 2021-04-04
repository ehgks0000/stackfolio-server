import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './repository/tag.repository';
@Module({
  imports: [TypeOrmModule.forFeature([TagRepository])],
  exports: [],
})
export class TagsModule {}

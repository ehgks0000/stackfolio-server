import { BadRequestException, ConflictException } from '@nestjs/common';
import { Post } from 'src/posts/entity/post.entity';
import {
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { CreateTagDto } from '../dto/create-tag.dto';

import { Tag } from '../entity/tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async createTag(tag: string): Promise<Tag> {
    const preTag = await this.findOne({ title: tag });
    if (!preTag) {
      const newTag = this.create({ title: tag });
      await this.save(newTag);

      console.log('새 태그입니다 !', newTag);
      return newTag;
    }
    console.log('새 태그입니다 !', preTag);
    return preTag;
  }
}

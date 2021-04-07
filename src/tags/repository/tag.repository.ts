import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';

import { Tag } from '../entity/tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async createTag(tag: string): Promise<Tag> {
    const preTag = this.findOne({ title: tag });
    if (!preTag) {
      const newTag = new Tag();
      newTag.title = tag;
      await this.save(newTag);
      return newTag;
    }
    return preTag;
  }
}

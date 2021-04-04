import { BadRequestException, ConflictException } from '@nestjs/common';
import { Register } from 'src/auth/entity/register.entity';
import { PostInformation } from 'src/posts/entity/post-information.entity';
import {
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';

import { Tag } from '../entity/tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async createTag(data) {
    const tag = new Tag();
    tag.title = data;
    await this.save(tag);

    return tag;
  }
}

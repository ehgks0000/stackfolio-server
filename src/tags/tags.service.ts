import { Injectable } from '@nestjs/common';
import { Tag } from './entity/tag.entity';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}
  async createTag(): Promise<Tag> {
    const tag = await this.tagRepository.createTag('test tag');
    return tag;
  }

  async getTags(): Promise<Tag[] | undefined> {
    const tags = await this.tagRepository.find();
    return tags;
  }
}

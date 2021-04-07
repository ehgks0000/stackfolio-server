import { Injectable } from '@nestjs/common';
import { Tag } from './entity/tag.entity';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}
  async createTag(tag: string): Promise<Tag> {
    const newTag = await this.tagRepository.createTag(tag);
    return newTag;
  }

  async getTags(): Promise<Tag[] | undefined> {
    const tags = await this.tagRepository.find();
    return tags;
  }
}

import { Controller, Get, Post } from '@nestjs/common';
import { Tag } from './entity/tag.entity';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getTags(): Promise<Tag[]> {
    return this.tagsService.getTags();
  }

  @Post()
  createTag(): Promise<Tag> {
    return this.tagsService.createTag();
  }
}

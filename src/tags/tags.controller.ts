import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
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
  @UseGuards(JwtAuthGuard)
  createTag(
    @Req() req,
    @Query('postId') postId: string,
    @Body() data: CreateTagDto,
  ): Promise<Tag[]> {
    return this.tagsService.createTag(req.user.id, postId, data);
  }

  //나중에 포스트 컨트롤러로 옮기자
  //태그 id 를 갖고있는 "내" 게시글
  @Get('posts/user')
  @UseGuards(JwtAuthGuard)
  getMyPostsOfTag(@Query('tagId') tagId: string, @Req() req) {
    return this.tagsService.getMyPostsOfTag(tagId, req.user.id);
  }

  // 태그 id 를 갖고있는 전체 게시글
  @Get('posts')
  @UseGuards(JwtAuthGuard)
  getPostsOfTag(@Query('tagId') tagId: string) {
    return this.tagsService.getPostsOfTag(tagId);
  }
  // 태그(이름)을 갖고있는 전체 게시글
  @Get('name')
  //   @UseGuards(JwtAuthGuard)
  getPostsOfTagName(@Query('tag') tagName: string) {
    return this.tagsService.getPostsOfTagByTittle(tagName);
  }
}

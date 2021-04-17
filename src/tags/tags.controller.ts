import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import docs from './tags.docs';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entity/tag.entity';
import { TagsService } from './tags.service';
import { Post as _Post } from 'src/posts/entity/post.entity';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getTags(): Promise<Tag[]> {
    return this.tagsService.getTags();
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation(docs.post['tags'].operation)
  @ApiOkResponse(docs.post['tags'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
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
  @Get('my/posts')
  @ApiBearerAuth()
  @ApiOperation(docs.get['tags/my/posts'].operation)
  @ApiOkResponse(docs.get['tags/my/posts'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  @UseGuards(JwtAuthGuard)
  getMyPostsOfTag(@Query('tagId') tagId: string, @Req() req): Promise<_Post[]> {
    return this.tagsService.getMyPostsOfTag(tagId, req.user.id);
  }

  // 태그 id 를 갖고있는 전체 게시글
  @Get('id')
  @ApiBearerAuth()
  @ApiOperation(docs.get['tags/id'].operation)
  @ApiOkResponse(docs.get['tags/id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  @UseGuards(JwtAuthGuard)
  getPostsOfTag(@Query('tagId') tagId: string): Promise<_Post[]> {
    return this.tagsService.getPostsOfTag(tagId);
  }
  // 태그(이름)을 갖고있는 전체 게시글
  @Get('name')
  @ApiOperation(docs.get['tags/name'].operation)
  @ApiOkResponse(docs.get['tags/name'].response[200])
  getPostsOfTagName(@Query('tag') tagName: string): Promise<_Post[]> {
    return this.tagsService.getPostsOfTagByTittle(tagName);
  }
}

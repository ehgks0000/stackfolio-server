import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as _Post } from './entity/post.entity';
import { PostsService } from './posts.service';
import docs from './posts.docs';
import { Tag } from 'src/tags/entity/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { PostComment } from './entity/post-comment.entity';
import { CreateCommentPostDto } from './dto/create_comment_post';
import { PostByUserResponseDto } from './dto/post-by-user-response.dto';
import { PostPagenation } from './dto/page.dto';
import { PostByIdResponseDto } from './dto/post-by-Id-response.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly tagsService: TagsService,
  ) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.post['posts'].operation)
  @ApiOkResponse(docs.post['posts'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  createPost(@Req() req, @Body() data: CreatePostDto): Promise<_Post> {
    return this.postsService.createPost(req.user.id, data);
  }
  // jwt req.user가 있고 없고로 endpoint 구분 가능한가?
  @Get('')
  @ApiOperation(docs.get['posts'].operation)
  @ApiOkResponse({ type: _Post, isArray: true })
  //   @ApiOkResponse(docs.get['posts'].response[200])
  getPostsAll(@Query() query: PostPagenation): Promise<_Post[]> {
    return this.postsService.getPostsAll(query.page, query.pageSize);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation(docs.get['posts/my'].operation)
  @ApiOkResponse(docs.get['posts/my'].response[200])
  getMyPosts(@Req() req): Promise<_Post[]> {
    return this.postsService.getPostsOfMy(req.user.id);
  }

  @Get('user/:user_id')
  @ApiOperation(docs.get['user/:user_id'].operation)
  //   @ApiOkResponse({ type: PostByUserResponseDto })
  @ApiOkResponse(docs.get['user/:user_id'].response[200])
  getPosts(@Param('user_id') userId: string) {
    //   getPosts(@Param('user_id') userId: string): Promise<PostByUserResponseDto> {
    return this.postsService.getPostsByUserId(userId);
  }

  @Get(':post_id')
  @ApiOperation(docs.get[':post_id'].operation)
  @ApiOkResponse(docs.get[':post_id'].response[200])
  getPost(@Param('post_id') postId: string): Promise<PostByIdResponseDto> {
    return this.postsService.getPostByPostId(postId);
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.patch[':post_id'].operation)
  @ApiOkResponse(docs.patch[':post_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  updatePost(
    @Req() req,
    @Query('post_id') postId: string,
    @Body() data: UpdatePostDto,
  ): Promise<_Post> {
    return this.postsService.updatePost(req.user.id, postId, data);
  }

  //   @Get('like')
  //   @UseGuards(JwtAuthGuard)
  //   getLikePosts(@Req() req) {
  //     return this.postsService.getLikePosts(req.user.id);
  //   }

  @Post('like/:post_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation(docs.post['like/:post_id'].operation)
  @ApiOkResponse(docs.post['like/:post_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  likePost(@Req() req, @Param('post_id') postId: string): Promise<void> {
    return this.postsService.likePost(req.user, postId);
  }

  @Post('unlike/:post_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation(docs.post['unlike/:post_id'].operation)
  @ApiOkResponse(docs.post['unlike/:post_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  unlikePost(@Req() req, @Param('post_id') postId: string): Promise<void> {
    return this.postsService.unlikePost(req.user.id, postId);
  }

  @Delete(':post_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.delete[':post_id'].operation)
  @ApiOkResponse(docs.delete[':post_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  deletePost(@Req() req, @Param('post_id') postId: string): Promise<_Post> {
    return this.postsService.deletePost(req.user.id, postId);
  }

  @Post('upload/thumbnail')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'thumbnail image',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @ApiOkResponse(docs.post['upload/thumbnail'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(
    @Req() req,
    @Query('post_id') postId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.postsService.uploadThumbnail(
      req.user.id,
      postId,
      file.buffer,
      file.originalname,
    );
  }

  @Post('upload/contentImages')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'content image',
    type: FileUploadDto,
  })
  @ApiBearerAuth()
  @ApiOkResponse(docs.post['upload/contentImages'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  @UseInterceptors(FileInterceptor('contentImages'))
  async uploadContentImages(
    @Req() req,
    @Query('post_id') postId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.postsService.uploadContentImages(
      req.user.id,
      postId,
      file.buffer,
      file.originalname,
    );
  }

  @Delete('delete/thumbnail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse(docs.delete['delete/thumbnail'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  deleteThumbnail(@Req() req, @Query('post_id') postId: string): Promise<void> {
    return this.postsService.deleteThumbnail(req.user.id, postId);
  }

  /**
   *
   * @todo
   *  게시글에 이미지 넣는거 삭제
   *  */
  @Delete('delete/comtentimage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse(docs.delete['delete/thumbnail'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  deleteContentImage(
    @Req() req,
    @Query('post_id') postId: string,
  ): Promise<void> {
    return this.postsService.deleteContentImages(req.user.id, postId);
  }

  @Get('comment/:post_id')
  @ApiOperation(docs.get['post/comment/:post_id'].operation)
  @ApiOkResponse(docs.get['post/comment/:post_id'].response[200])
  getComments(@Param('post_id') post_id: string): Promise<PostComment[]> {
    return this.postsService.getComments(post_id);
  }

  @Post('comment/:post_id/:comment_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.post['post/comment/:post_id/:comment_id'].operation)
  @ApiOkResponse(docs.post['post/comment/:post_id/:comment_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  createCommenttest(
    @Req() req,
    @Param('post_id') post_id: string,
    @Param('comment_id') comment_id: number,
    // @Body() data: CreateCommentPostDto,
  ): Promise<void> {
    return this.postsService.createComment(req.user.id, post_id, comment_id);
  }

  // 태그아이디를 갖는 게시글 전체 찾기
  @Get('tag/:tag_id')
  getPostByTagID(@Param('tag_id') tagId: string): Promise<_Post[]> {
    return this.postsService.getPostByTagID(tagId);
  }
  // 태그이름을 갖는 게시글 전체 찾기
  @Get('tag/:tag_name')
  getPostByTagName(@Param('tag_name') tagName: string): Promise<_Post[]> {
    return this.postsService.getPostByTagName(tagName);
  }

  // 태그 아이디로 내 게시글 전체 찾기
  @Get('tag/:tag_id/my')
  @UseGuards(JwtAuthGuard)
  getMyPostByTagID(
    @Req() req,
    @Param('tag_id') tagId: string,
  ): Promise<_Post[]> {
    return this.postsService.getMyPostByTagID(req.user.id, tagId);
  }

  // 태그이름으로 내 게시글 전체 찾기
  @Get('tag/:tag_name/my')
  @UseGuards(JwtAuthGuard)
  getMyPostByTagName(
    @Req() req,
    @Param('tag_name') tagName: string,
  ): Promise<_Post[]> {
    return this.postsService.getMyPostByTagName(req.user.id, tagName);
  }

  @Get('series/:series_name/my')
  @UseGuards(JwtAuthGuard)
  getMyPostBySeriesName(
    @Req() req,
    @Param('series_name') seriesName: string,
  ): Promise<_Post[]> {
    return this.postsService.getMyPostBySeriesName(req.user.id, seriesName);
  }
}

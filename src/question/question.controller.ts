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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateCommentQuestionDto } from './dto/create_comment_question';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entity/question.entity';
import { QuestionService } from './question.service';
import docs from './question.docs';
import { QuestionComment } from './entity/question-comment.entity';

@ApiTags('Questions')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.post['question'].operation)
  @ApiOkResponse(docs.post['question'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  createPost(@Req() req, @Body() data: CreateQuestionDto): Promise<Question> {
    return this.questionService.createQuestion(req.user.id, data);
  }

  @Get()
  @ApiOperation(docs.get['question'].operation)
  @ApiOkResponse(docs.get['question'].response[200])
  getQuestionAll(): Promise<Question[]> {
    return this.questionService.getQuestionAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.get['question/my'].operation)
  @ApiOkResponse(docs.get['question/my'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  getMyQuestions(@Req() req): Promise<Question[]> {
    return this.questionService.getMyQuestions(req.user.id);
  }

  @Get('user/:user_id')
  @ApiOperation(docs.get['user/:user_id'].operation)
  @ApiOkResponse(docs.get['user/:user_id'].response[200])
  getPosts(@Param('user_id') userId: string): Promise<Question[]> {
    return this.questionService.getQuestionsByUserId(userId);
  }

  @Get(':question_id')
  @ApiOperation(docs.get[':question_id'].operation)
  @ApiOkResponse(docs.get[':question_id'].response[200])
  getPost(@Param('question_id') questionId: string): Promise<Question> {
    return this.questionService.getQuestionByQuestionId(questionId);
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.patch['question/:question_id'].operation)
  @ApiOkResponse(docs.patch['question/:question_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  updatePost(
    @Req() req,
    @Query('question_id') questionId: string,
    @Body() data: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionService.updateQuestion(req.user.id, questionId, data);
  }

  @Post('like/:question_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation(docs.post['question/like/:question_id'].operation)
  @ApiOkResponse(docs.post['question/like/:question_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  likeQuestion(
    @Req() req,
    @Param('question_id') questionId: string,
  ): Promise<void> {
    return this.questionService.likeQuestion(req.user, questionId);
  }

  @Post('unlike/:question_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation(docs.post['question/unlike/:question_id'].operation)
  @ApiOkResponse(docs.post['question/unlike/:question_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  unlikeQuestion(
    @Req() req,
    @Param('question_id') questionId: string,
  ): Promise<void> {
    return this.questionService.unlikeQuestion(req.user.id, questionId);
  }

  @Delete(':question_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.delete['question/:question_id'].operation)
  @ApiOkResponse(docs.delete['question/:question_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  deleteQuestion(
    @Req() req,
    @Param('question_id') question_id: string,
  ): Promise<Question> {
    return this.questionService.deleteQuestion(req.user.id, question_id);
  }

  @Get('comment/:question_id')
  @ApiOperation(docs.get['question/comment/:question_id'].operation)
  @ApiOkResponse(docs.get['question/comment/:question_id'].response[200])
  getComments(
    @Param('question_id') question_id: string,
  ): Promise<QuestionComment[]> {
    return this.questionService.getComments(question_id);
  }

  @Post('comment/:question_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.post['question/comment/:question_id'].operation)
  @ApiOkResponse(docs.post['question/comment/:question_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  createComment(
    @Req() req,
    @Param('question_id') question_id: string,
    @Body() data: CreateCommentQuestionDto,
  ): Promise<void> {
    return this.questionService.createComment(req.user.id, question_id, data);
  }

  // 태그아이디를 갖는 게시글 전체 찾기
  @Get('tag/:tag_id')
  getPostByTagID(@Param('tag_id') tagId: string): Promise<Question[]> {
    return this.questionService.getPostByTagID(tagId);
  }
  // 태그이름을 갖는 게시글 전체 찾기
  @Get('tag/:tag_name')
  getPostByTagName(@Param('tag_name') tagName: string): Promise<Question[]> {
    return this.questionService.getPostByTagName(tagName);
  }

  // 태그 아이디로 내 게시글 전체 찾기
  @Get('tag/:tag_id/my')
  @UseGuards(JwtAuthGuard)
  getMyPostByTagID(
    @Req() req,
    @Param('tag_id') tagId: string,
  ): Promise<Question[]> {
    return this.questionService.getMyPostByTagID(req.user.id, tagId);
  }

  // 태그이름으로 내 게시글 전체 찾기
  @Get('tag/:tag_name/my')
  @UseGuards(JwtAuthGuard)
  getMyPostByTagName(
    @Req() req,
    @Param('tag_name') tagName: string,
  ): Promise<Question[]> {
    return this.questionService.getMyPostByTagName(req.user.id, tagName);
  }

  //질문은 시리즈가 없다.
  //   @Get('series/:series_name')
  //   getPostBySeriesName(
  //     @Param('series_name') seriesName: string,
  //   ): Promise<Question[]> {
  //     return this.questionService.getPostBySerisName(seriesName);
  //   }

  //   @Get('series/:series_name/my')
  //   @UseGuards(JwtAuthGuard)
  //   getMyPostBySeriesName(
  //     @Req() req,
  //     @Param('series_name') seriesName: string,
  //   ): Promise<Question[]> {
  //     return this.questionService.getMyPostBySeriesName(req.user.id, seriesName);
  //   }
}

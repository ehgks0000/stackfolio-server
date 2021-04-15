import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
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
  getQuestionAll(): Promise<Question[]> {
    return this.questionService.getQuestionAll();
  }

  @Patch(':question_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updatePost(
    @Req() req,
    @Param('question_id') questionId: string,
    @Body() data: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionService.updateQuestion(req.user.id, questionId, data);
  }

  @Post('like/:question_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  likePost(
    @Req() req,
    @Param('question_id') questionId: string,
  ): Promise<void> {
    return this.questionService.likeQuestion(req.user, questionId);
  }

  @Post('unlike/:question_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  unlikePost(
    @Req() req,
    @Param('question_id') questionId: string,
  ): Promise<void> {
    return this.questionService.unlikeQuestion(req.user.id, questionId);
  }

  @Delete(':question_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deletePost(
    @Req() req,
    @Param('question_id') question_id: string,
  ): Promise<Question> {
    return this.questionService.deletePost(req.user.id, question_id);
  }

  @Get('comment/:question_id')
  getComments(
    @Param('question_id') question_id: string,
  ): Promise<QuestionComment[]> {
    return this.questionService.getComments(question_id);
  }

  @Post('comment/:question_id')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Req() req,
    @Param('question_id') question_id: string,
    @Body() data: CreateCommentQuestionDto,
  ): Promise<void> {
    return this.questionService.createComment(req.user.id, question_id, data);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { Question } from './entity/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionRepository } from './repository/question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionCommentRepository } from './repository/question-comment.repository';
import { CreateCommentQuestionDto } from './dto/create_comment_question';
import { QuestionComment } from './entity/question-comment.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: QuestionRepository,
    private readonly questionCommentRepository: QuestionCommentRepository,
  ) {}

  async createQuestion(
    userId: string,
    data: CreateQuestionDto,
  ): Promise<Question> {
    const question = await this.questionRepository.createQuestion(userId, data);
    return question;
  }

  async getQuestionAll(): Promise<Question[]> {
    const questions = await this.questionRepository.find();
    return questions;
  }

  async getMyQuestions(userId: string): Promise<Question[]> {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.user_like', 'user_like')
      .leftJoinAndSelect('question.comments', 'comments')
      .where('question.user_id= :userId', { userId: userId })
      .getMany();

    return questions;
  }

  async updateQuestion(
    userId: string,
    questionId: string,
    data: UpdateQuestionDto,
  ): Promise<Question> {
    let question = await this.questionRepository.findOne({
      id: questionId,
      user_id: userId,
    });

    question = {
      ...question,
      ...data,
    };
    await this.questionRepository.save(question);

    return question;
  }

  async deleteQuestion(userid: string, questionId: string): Promise<Question> {
    const question = await this.questionRepository.findOne({
      id: questionId,
      user_id: userid,
    });

    await this.questionRepository.remove(question);
    return question;
  }

  // 질문 게시글 좋아요, 싫어요
  async likeQuestion(me: User, questionId: string): Promise<void> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['user_like'],
    });

    question.user_like_ids.forEach((id) => {
      if (id === me.id) {
        throw new BadRequestException('이미 좋아요 했습니다.');
      }
    });

    question.user_like = [...question.user_like, me];
    await this.questionRepository.save(question);
  }

  async unlikeQuestion(userId: string, questionId: string): Promise<void> {
    const unlikeQuestion = await this.questionRepository.findOne({
      id: questionId,
    });
    unlikeQuestion.user_like = unlikeQuestion.user_like.filter((user) => {
      user.id !== userId;
    });

    await this.questionRepository.save(unlikeQuestion);
  }
  async getComments(question_id: string): Promise<QuestionComment[]> {
    const comments = await this.questionCommentRepository.find({
      //   question_id,
      where: {
        question_id,
      },
      order: { group: 'ASC', sorts: 'ASC' },
    });
    return comments;
  }

  async createComment(
    userId: string,
    question_id: string,
    data: CreateCommentQuestionDto,
  ): Promise<void> {
    await this.questionCommentRepository.createQuestionComment(
      userId,
      question_id,
      data,
    );

    // return {} as any;
  }
}

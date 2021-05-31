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

  //전체 질문
  async getQuestionAll(): Promise<Question[]> {
    const questions = await this.questionRepository.find();
    return questions;
  }
  //내 질문
  async getMyQuestions(userId: string): Promise<Question[]> {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.user_like', 'user_like')
      .leftJoinAndSelect('question.comments', 'comments')
      .where('question.user_id= :userId', { userId: userId })
      .orderBy('question.created_at', 'DESC')
      .getMany();

    return questions;
  }
  //공개된것만
  async getQuestionsByUserId(userId: string): Promise<Question[]> {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.metadata', 'metadata')
      .where('question.user_id= :userId', { userId: userId })
      .andWhere('metadata.is_private = false')
      .getMany();

    return questions;
  }

  //공개된것만
  async getQuestionByQuestionId(questionId: string): Promise<Question> {
    const question = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.metadata', 'metadata')
      .where('question.id= :questionId', { questionId: questionId })
      .andWhere('metadata.is_private =false')
      .getOne();
    return question;
  }

  async updateQuestion(
    userId: string,
    questionId: string,
    data: UpdateQuestionDto,
  ): Promise<Question> {
    const question = await this.questionRepository.updateQuestion(
      userId,
      questionId,
      data,
    );

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
      where: { id: questionId },
      relations: ['user_like'],
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

  async getPostByTagID(tagId: string): Promise<Question[]> {
    const questions = await this.questionRepository.find({
      where: { tag_id: tagId },
    });

    return questions;
  }

  async getPostByTagName(tagName: string): Promise<Question[]> {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tags')
      .where('tags.title =: tagName', { tagName: tagName })
      .getMany();

    // const posts = await this.postRepository.find({
    //   where: {},
    //   relations: [''],
    // });
    return questions;
  }

  async getMyPostByTagID(userId: string, tagId: string): Promise<Question[]> {
    const questions = await this.questionRepository.find({
      where: { user_id: userId, tag_id: tagId },
    });
    return questions;
  }

  async getMyPostByTagName(
    userId: string,
    tagName: string,
  ): Promise<Question[]> {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.tags', 'tags')
      .where('question.userId =:userId', { userId: userId })
      .andWhere('tags.title =:tagName', { tagName: tagName })
      .getMany();

    return questions;
  }

  // 질문은 시리즈가 없다
  //   async getPostBySerisName(seriesName: string): Promise<Question[]> {
  //     const questions = await this.questionRepository
  //       .createQueryBuilder('question')
  //       .leftJoinAndSelect('question.series', 'series')
  //       .leftJoinAndSelect('question.metadata', 'metadata')
  //       .where('metadata.is_private = false')
  //       .andWhere('series.name =: seriesName', { seriesName: seriesName })
  //       .getMany();

  //     return questions;
  //   }

  //   async getMyPostBySeriesName(
  //     userId: string,
  //     seriesName: string,
  //   ): Promise<Question[]> {
  //     const questions = await this.questionRepository
  //       .createQueryBuilder('question')
  //       .leftJoinAndSelect('question.series', 'series')
  //       .where('question.userId= :userId', { userId: userId })
  //       .andWhere('series.name= :seriesName', { seriesName: seriesName })
  //       .getMany();

  //     return questions;
  //   }
}

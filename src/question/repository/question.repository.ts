import { Verification } from 'src/auth/entity/verification.entity';

import {
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { Question } from '../entity/question.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { QuestionInformation } from '../entity/question-information.entity';
import { QuestionMetadata } from '../entity/question-metadata.entity';
import { TagRepository } from 'src/tags/repository/tag.repository';
import { Tag } from 'src/tags/entity/tag.entity';
import { UpdateQuestionDto } from '../dto/update-question.dto';

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {
  async createQuestion(userId: string, data: CreateQuestionDto) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const {
      title,
      contents,
      tags,
      slug,
      thumbnail,
      description,
      is_private = 'false',
      published = 'false',
    } = data;

    try {
      const userRepository = getRepository(User);
      const tagRepository = getRepository(Tag);
      const user = await userRepository.findOne({ id: userId });
      if (!user) {
        throw new NotFoundException('질문 작성오류, 로그인해주세요!');
      }

      const question = new Question();
      question.title = title;
      question.contents = contents;
      question.user_id = userId;
      //   user.profile.question_count += 1;

      question.tags = [];
      let newTags = [];
      let dummy = [];

      if (tags) {
        const checkTags = tags.map(async (tag) => {
          const preTag = await tagRepository.findOne({ title: tag });
          if (!preTag) {
            const newTag = tagRepository.create({ title: tag });
            newTags = [...newTags, newTag];
          } else {
            dummy = [...dummy, preTag];
          }
        });

        await Promise.all(checkTags).then(async () => {
          await tagRepository.save(newTags);
          dummy = [...dummy, ...newTags];
          question.tags = dummy;

          dummy = null;
        });
      }

      const information = new QuestionInformation();
      information.slug = slug;
      information.thumbnail = thumbnail;
      information.description = description;
      const metadata = new QuestionMetadata();
      metadata.is_private = JSON.parse(is_private);
      metadata.published = JSON.parse(published);

      question.information = information;
      question.metadata = metadata;

      //   user.questions = [question];

      await queryRunner.manager.save(information);
      await queryRunner.manager.save(metadata);
      await queryRunner.manager.save(question);
      //   await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return question;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateQuestion(
    userId: string,
    questionId: string,
    data: UpdateQuestionDto,
  ): Promise<Question> {
    const tagRepository = getRepository(Tag);
    const questionInformationRepository = getRepository(QuestionInformation);
    const questionMetadataRepository = getRepository(QuestionMetadata);

    const {
      title,
      contents,
      tags,
      slug,
      thumbnail,
      description,
      is_private,
      published,
    } = data;
    let question = await this.findOne(
      { id: questionId, user_id: userId },
      { relations: ['tags', 'information', 'metadata'] },
    );

    question = {
      ...question,
      title,
      contents,
    };

    let newTags = [];
    let dummy = [];
    if (tags) {
      const checkTags = tags.map(async (tag) => {
        const preTag = await tagRepository.findOne({ title: tag });
        if (!preTag) {
          const newTag = tagRepository.create({ title: tag });
          newTags = [...newTags, newTag];
        } else {
          dummy = [...dummy, preTag];
        }
      });

      await Promise.all(checkTags).then(async () => {
        await tagRepository.save(newTags);

        dummy = [...dummy, ...newTags];
        question.tags = dummy;

        dummy = null;
      });
    }

    const information = question.information;
    information.slug = slug;
    information.thumbnail = thumbnail;
    information.description = description;
    const metadata = question.metadata;
    metadata.is_private = JSON.parse(is_private);
    metadata.published = JSON.parse(published);

    question.information = information;
    question.metadata = metadata;

    try {
      //   await questionI;
      await this.save(question);
      await questionInformationRepository.save(information);
      await questionMetadataRepository.save(metadata);
    } catch (error) {
      console.error;
    }

    return question;
  }
}

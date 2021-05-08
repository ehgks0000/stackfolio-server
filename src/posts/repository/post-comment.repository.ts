import { Verification } from 'src/auth/entity/verification.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entity/post.entity';
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
import { PostInformation } from '../entity/post-information.entity';
import { PostMetadata } from '../entity/post-metadata.entity';
// import { PostLike } from '../entity/post-like.entity';
import { PostComment } from '../entity/post-comment.entity';
import { CreateCommentPostDto } from '../dto/create_comment_post';

@EntityRepository(PostComment)
export class PostCommentRepository extends Repository<PostComment> {
  // eslint-disable-next-linee
  async createPostComment(
    userId: string,
    post_id: string,
    data: CreateCommentPostDto,
  ): Promise<void> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const postRepository = getRepository(Post);
      const userProfileRepository = getRepository(UserProfile);

      const { id, group, sorts, depth, contents } = data;

      const post = await postRepository.findOne({ id: post_id });
      if (!post) {
        throw new NotFoundException('게시글이 존재 하지 않습니다.');
      }
      const user = await userProfileRepository.findOne({ user_id: userId });
      if (!user) {
        throw new NotFoundException('유저가 존재 하지 않습니다.');
      }

      if (!group) {
        const { max } = await this.createQueryBuilder('postcomment')
          .select('MAX(postcomment.group)')
          .where(`postcomment.post_id = :post_id`, {
            post_id: post_id,
          })
          .getRawOne();

        const comment = new PostComment();

        comment.group = max + 1;
        // comment.sorts = ;
        // comment.depth = ;
        comment.contents = contents;
        comment.user_id = userId;
        comment.post_id = post_id;

        console.log(comment);
        // await questionCommentRepository.save(comment);
        post.comment_count += 1;
        user.exp++;
        await queryRunner.manager.save(user);
        await queryRunner.manager.save(post);
        await queryRunner.manager.save(comment);

        // return comment;
      } else {
        //대댓글

        // .from("QuestionComment", "comment")
        // NVL함수 사용 어떻게?

        //   1. SELECT NVL(MIN(SORTS),0) FROM QuestionComment
        //  WHERE  BGROUP = (원글의 GROUP)
        //  AND SORTS > (원글의 SORTS)
        //  AND DEPTH <= (원글의 DEPTH)
        //----------
        // 쿼리 빌더
        let { min } = await this.createQueryBuilder('comment')
          .select('MIN(sorts)')
          .where(
            `comment.group = :group AND comment.sorts > :sorts AND comment.depth <= :depth`,
            { group: group, sorts: sorts, depth: depth },
          )
          .getRawOne();

        min = min ?? 0;

        console.log('--------min------ : ', min);
        //-----------------
        // 생쿼리
        // let min = await questionCommentRepository.query(
        //   `SELECT NVL(MIN(sorts), 0) FROM question_comment WHERE group = ${group} AND sorts >= ${sorts} AND depth <= ${depth}`,
        // );
        if (min === 0) {
          //3. SELECT NVL(MAX(SORTS),0) + 1 FROM BOARD
          // WHERE GROUP = (원글의 BGROUP);

          // 4. INSERT INTO BOARD VALUES
          //    (번호, (원글의 GROUP), (3번값), (원글의 DEPTH +1) ,' 제목')

          const { max: max_2 } = await this.createQueryBuilder('comment')
            .select('MAX(sorts)')
            .where('comment.group = :group', { group: group })
            .getRawOne();

          console.log('-----------------Before max--------', max_2);

          //   max_2 = (max_2 ?? 0) + 1;

          //-------------------
          // 생쿼리
          //   const max = await questionCommentRepository.query(`
          //         SELECT NVL(MAX(sorts), 0) + 1 FROM question_comment WHERE group = ${group}
          //   `);
          console.log('-----------------After max--------', max_2);
          const comment = new PostComment();
          //id 는 자동생성
          comment.group = group;
          comment.sorts = (max_2 ?? 0) + 1;
          //   comment.sorts = max + 1;
          comment.depth = depth + 1;
          comment.contents = contents;

          comment.user_id = userId;
          comment.post_id = post_id;

          console.log('1번', comment);

          //   await questionCommentRepository.save(comment);
          post.comment_count += 1;
          user.exp++;
          await queryRunner.manager.save(user);
          await queryRunner.manager.save(post);
          await queryRunner.manager.save(comment);
        } else {
          //3. UPDATE BOARD SET SORTS = SORTS + 1
          // WHERE GROUP =  (원글의 BGROUP)  AND SORTS >= (1번값)

          // 4. INSERT INTO BOARD VALUES
          //    (번호, (원글의 BGROUP), (1번값), (원글의 DEPTH +1) ,' 제목')

          //-------------------------------
          // 왜 + 1이 안될까?
          try {
            // await questionCommentRepository
            //   .createQueryBuilder()
            //   .update(QuestionComment)
            //   //   .set({ sorts: sorts + 1 })
            //   .set({ sorts: () => '"sorts" + 1' })
            //   .where('"group" = :group AND sorts >= :sorts', {
            //     group: group,
            //     sorts: sorts,
            //   })
            //   .execute();
            // ---------------------------
            //   생쿼리 ? 에러 : group에 쌍따움표로 안감싸면 오류 왜? // 쿼리빌더로 하면 제대로 실행안됨 왜?
            await this.query(
              `UPDATE post_comment SET sorts = sorts + 1 WHERE "group" = ${group} AND "sorts" >= ${min}`,
            );
          } catch (error) {
            console.error(error);
          }

          const comment = new PostComment();

          //id 는 자동생성
          comment.group = group;
          comment.sorts = min;
          comment.depth = depth + 1;
          comment.contents = contents;

          comment.user_id = userId;
          comment.post_id = post_id;

          console.log('2번', comment);
          //   await questionCommentRepository.save(comment);
          post.comment_count += 1;
          user.exp++;
          await queryRunner.manager.save(user);
          await queryRunner.manager.save(post);
          await queryRunner.manager.save(comment);
        }
        //   await questionCommentRepository.save(comment);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

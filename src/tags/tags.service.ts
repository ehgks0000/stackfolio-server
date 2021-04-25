import { Injectable } from '@nestjs/common';
import { Post } from 'src/posts/entity/post.entity';
import { PostRepository } from 'src/posts/repository/post.repository';
import { ConnectionManager, getConnection, getRepository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entity/tag.entity';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagsService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly postRepository: PostRepository,
  ) {}

  // 전체 태그 검색
  // 나중에 삭제
  async getTags(): Promise<Tag[] | undefined> {
    const tags = await this.tagRepository.find({
      order: { created_at: 'DESC' },
      //   relations: ['posts'],
    });

    return tags;
  }
  async createTag(
    userId: string,
    postId: string,
    data: CreateTagDto,
  ): Promise<Tag[]> {
    let dummy = [];
    let newTags = [];
    const { tags } = data;

    const post = await this.postRepository.findOne({
      id: postId,
      user_id: userId,
    });

    //forEach는 비동기 작업 안해줌 -> for of는 가능(직렬처리라 성능 별로)
    //-> promise.all로 해결
    const checkTags = tags.map(async (tag) => {
      const preTag = await this.tagRepository.findOne({ title: tag });
      if (!preTag) {
        const newTag = this.tagRepository.create({ title: tag });
        newTags = [...newTags, newTag];
      } else {
        dummy = [...dummy, preTag];
      }
    });

    await Promise.all(checkTags)
      .then(async () => {
        await this.tagRepository.save(newTags);
        dummy = [...dummy, ...newTags];

        post.tags = dummy;
        dummy = null;
      })
      .then(async () => {
        await this.postRepository.save(post);
      });

    return post.tags;
  }
  // 태그 수정 없이 createTag를 해서 post에 삽입
  // async updateTags() {
  //   return;
  // }
  //태그를 사용하는 "나의" 전체 게시글
  async getMyPostsOfTag(tagId: string, userId: string): Promise<Post[]> {
    const posts = await this.postRepository.find({
      where: { tag_id: tagId, user_id: userId },
    });
    // posts.length;

    return posts;
    // await this.tagRepository.find({ where: { id: tagId } });
  }

  //태그를 사용하는 전체 게시글
  async getPostsOfTag(tagId: string): Promise<Post[]> {
    const posts = await this.postRepository.find({
      where: { tag_id: tagId },
    });

    return posts;
  }
  //태그 제목으로 게시글
  //   : Promise<Post[]>
  async getPostsOfTagByTittle(tagName: string): Promise<Post[]> {
    const { posts } = await this.tagRepository.findOne({
      where: { title: tagName },
      relations: ['posts'],
    });

    console.log(posts);
    return posts;
  }

  //조인테이블만 삭제 (post와 tag 테이블의 관계도 같이 삭제)
  // Post_tag
  // 차집합으로 빼주지 않아도 post repository에서 수정을 하게되면
  // 조인테이블에서 자동 삭제됨
  async deleteTag(
    userId: string,
    postId: string,
    tagId: string,
  ): Promise<void> {
    ///////////
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from('post_tag')
      .where('postId = :postId AND tagId = :tagId', {
        postId: postId,
        tagId: tagId,
      })
      .execute();

    await this.tagRepository.delete({ id: tagId });
  }

  // async test() {
  //   const tet = await connect;
  //   return;
  // }
}

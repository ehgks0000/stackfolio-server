import { Injectable } from '@nestjs/common';
import { PostRepository } from 'src/posts/repository/post.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entity/tag.entity';
import { TagRepository } from './repository/tag.repository';

@Injectable()
export class TagsService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly postRepository: PostRepository,
  ) {}

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
      })
      .then(async () => {
        await this.postRepository.save(post);
      });

    return dummy;
  }

  async updateTags() {
    return;
  }
  //태그를 사용하는 "나의" 전체 게시글
  async getMyPostsOfTag(tagId: string, userId: string) {
    const posts = await this.postRepository.find({
      where: { tag_id: tagId, user_id: userId },
    });

    return posts;
    // await this.tagRepository.find({ where: { id: tagId } });
  }

  //태그를 사용하는 전체 게시글
  async getPostsOfTag(tagId: string) {
    const posts = await this.postRepository.find({
      where: { tag_id: tagId },
    });

    return posts;
  }
  async getPostsOfTagByTittle(tagName: string) {
    const posts = await this.postRepository.find({
      where: { title: tagName },
    });

    return posts;
  }
}

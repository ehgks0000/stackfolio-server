import { Verification } from 'src/auth/entity/verification.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../entity/post.entity';
import {
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { PostInformation } from '../entity/post-information.entity';
import { PostMetadata } from '../entity/post-metadata.entity';
import { Tag } from 'src/tags/entity/tag.entity';
import { UpdatePostDto } from '../dto/update-post.dto';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(userId: string, data: CreatePostDto): Promise<Post> {
    const userRepository = getRepository(User);
    const postRepository = getRepository(Post);
    const postInformationRepository = getRepository(PostInformation);
    const postMetadataRepository = getRepository(PostMetadata);
    const tagRepository = getRepository(Tag);

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
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) {
      throw new BadRequestException('게시글 작성오류, 로그인해주세요!');
    }

    const post = new Post();
    post.title = title;
    post.contents = contents;
    post.user_id = userId;
    user.profile.post_count++;
    user.profile.exp++;

    post.tags = [];
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
        post.tags = dummy;

        dummy = null;
      });
    }

    const information = new PostInformation();
    information.slug = slug;
    information.thumbnail = thumbnail;
    information.description = description;
    const metadata = new PostMetadata();
    metadata.is_private = JSON.parse(is_private);
    metadata.published = JSON.parse(published);

    post.information = information;
    post.metadata = metadata;

    try {
      await postInformationRepository.save(information);
      await postMetadataRepository.save(metadata);
      await userRepository.save(user);
      await postRepository.save(post);
    } catch (err) {
      console.error(err);
    }
    return post;
  }

  async updatePost(
    userId: string,
    postId: string,
    data: UpdatePostDto,
  ): Promise<Post> {
    const userProfileRepository = getRepository(UserProfile);
    const postRepository = getRepository(Post);
    const postInformationRepository = getRepository(PostInformation);
    const postMetadataRepository = getRepository(PostMetadata);
    const tagRepository = getRepository(Tag);

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

    let post = await postRepository.findOne(
      {
        id: postId,
        user_id: userId,
      },
      { relations: ['tags', 'information', 'metadata'] },
    );

    post = {
      ...post,
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
        post.tags = dummy;

        dummy = null;
      });
    }

    const information = post.information;
    information.slug = slug;
    information.thumbnail = thumbnail;
    information.description = description;

    const metadata = post.metadata;
    metadata.is_private = JSON.parse(is_private);
    metadata.published = JSON.parse(published);

    post.information = information;
    post.metadata = metadata;

    try {
      await postInformationRepository.save(information);
      await postMetadataRepository.save(metadata);
      await postRepository.save(post);
    } catch (error) {
      console.error(error);
    }

    return post;
  }
}

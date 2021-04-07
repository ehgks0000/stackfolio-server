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
import { TagRepository } from 'src/tags/repository/tag.repository';
import { UpdatePostDto } from '../dto/update-post.dto';
import { boolean } from 'joi';
import { FilesService } from 'src/files/files.service';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(userId: string, data: CreatePostDto): Promise<Post> {
    const userProfileRepository = getRepository(UserProfile);
    const postRepository = getRepository(Post);
    const postInformationRepository = getRepository(PostInformation);
    const postMetadataRepository = getRepository(PostMetadata);
    const tagsRepository = getRepository(Tag);

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

    const userProfile = await userProfileRepository.findOne(
      {
        user_id: userId,
      },
      { relations: ['user'] },
    );

    const user = userProfile.user;

    const post = new Post();
    post.title = title;
    post.contents = contents;
    post.user_id = user.id;
    post.tags = [];

    // 태그 만들기
    if (tags) {
      tags.map(async (tag) => {
        const preTag = await tagsRepository.findOne({
          title: tag,
        });

        // 다른 유저가 같은 이름의 태그를 만들어 놓으면
        // 새로 태그 생성하지 않고 post에 태그 걸어주기
        if (!preTag) {
          const newTag = tagsRepository.create({
            title: tag,
          });
          console.log('새태그 : ', newTag);

          post.tags = [...post.tags, newTag];
          await tagsRepository.save(newTag);
        } else {
          console.log('이미 있는 태그 : ', preTag);
          post.tags = [...post.tags, preTag];
        }
      });
    }

    const information = new PostInformation();
    information.slug = slug;
    information.thumbnail = thumbnail;
    information.description = description;
    const metadata = new PostMetadata();
    metadata.is_private = Boolean(is_private);
    metadata.published = Boolean(published);

    post.information = information;
    post.metadata = metadata;

    try {
      await postInformationRepository.save(information);
      await postMetadataRepository.save(metadata);
      await postRepository.save(post);
      //   await userRepository.save(user);
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
    const tagsRepository = getRepository(Tag);

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
    post.tags = [];

    if (tags) {
      tags.map(async (tag) => {
        const preTag = await tagsRepository.findOne({
          title: tag,
        });
        if (!preTag) {
          //   const newTag = await tagsRepository.createTag(tag);
          const newTag = tagsRepository.create({
            title: tag,
          });
          //   post.tags= [...post.tags, newTag.id]
          post.tags = [...post.tags, newTag];
          await tagsRepository.save(newTag);
        } else {
          post.tags = [...post.tags, preTag];
        }
      });
    }
    const information = post.information;
    information.slug = slug;
    information.thumbnail = thumbnail;
    information.description = description;

    const metadata = post.metadata;
    metadata.is_private = Boolean(is_private);
    metadata.published = Boolean(published);

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

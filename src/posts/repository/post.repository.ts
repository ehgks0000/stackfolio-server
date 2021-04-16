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
import { POINT_CONVERSION_HYBRID } from 'constants';
import { TagsService } from 'src/tags/tags.service';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  //   constructor(private readonly tagService: TagsService) {}
  async createPost(userId: string, data: CreatePostDto): Promise<Post> {
    // const tagService: TagsService;
    const userRepository = getRepository(User);
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

    // const userProfile = await userProfileRepository.findOne(
    //   {
    //     user_id: userId,
    //   },
    //   { relations: ['user'] },
    // );

    // const user = userProfile.user;
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) {
      throw new BadRequestException('');
    }

    const post = new Post();
    post.title = title;
    post.contents = contents;

    // user.posts = [...user.posts, post];
    post.user_id = userId;
    // post.author.profile.post_count += 1;
    user.profile.post_count += 1;

    // post.user_id = user.id;
    post.tags = [];
    let newTags = [];
    let dummy = [];
    if (tags) {
      //   tagService.createTag(userId, post.id, tags);
      const checkTags = tags.map(async (tag) => {
        const preTag = await tagRepository.findOne({ title: tag });
        if (!preTag) {
          const newTag = tagRepository.create({ title: tag });
          newTags = [...newTags, newTag];
        } else {
          dummy = [...dummy, preTag];
        }
      });

      await Promise.all(checkTags)
        .then(async () => {
          await tagRepository.save(newTags);
          dummy = [...dummy, ...newTags];
          post.tags = dummy;

          dummy = null;
        })
        .then(async () => {
          //   await postRepository.save(post);
        });
    }

    // // 태그 만들기
    // if (tags) {
    //   tags.map(async (tag) => {
    //     const preTag = await tagsRepository.findOne({
    //       title: tag,
    //     });

    //     // 다른 유저가 같은 이름의 태그를 만들어 놓으면
    //     // 새로 태그 생성하지 않고 post에 태그 걸어주기
    //     if (!preTag) {
    //       const newTag = tagsRepository.create({
    //         title: tag,
    //       });
    //       console.log('새태그 : ', newTag);

    //       post.tags = [...post.tags, newTag];
    //       await tagsRepository.save(newTag);
    //     } else {
    //       console.log('이미 있는 태그 : ', preTag);
    //       post.tags = [...post.tags, preTag];
    //     }
    //   });
    // }

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

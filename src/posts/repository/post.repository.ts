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

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  constructor(private readonly tagRepository: TagRepository) {
    super();
  }
  async createPost(userId: string, data: CreatePostDto): Promise<Post> {
    const userRepository = getRepository(User);
    const userProfileRepository = getRepository(UserProfile);
    const postRepository = getRepository(Post);
    const postInformationRepository = getRepository(PostInformation);
    const postMetadataRepository = getRepository(PostMetadata);
    const tagsRepository = getRepository(Tag);

    // const post = postRepository.create();

    const userProfile = await userProfileRepository.findOne(
      {
        user_id: userId,
      },
      { relations: ['user'] },
    );

    const user = userProfile.user;
    // console.log('유저 프로필 : ', user);

    const post = new Post();
    post.title = data.title;
    post.contents = data.contents;
    // post.author = user;
    post.user_id = user.id;

    // 태그 만들기
    if (data.tags) {
      console.log(data.tags);
      data.tags.map(async (tag) => {
        const preTag = await tagsRepository.findOne({
          title: tag,
        });

        // 다른 유저가 같은 이름의 태그를 만들어 놓으면
        // 새로 태그 생성하지 않고 post에 태그 걸어주기
        if (!preTag) {
          //다른 레포지토리 불러와서 생성이 되나?
          // const newTags = await this.tagRepository.createTag(tag);

          const newTag = new Tag();
          newTag.title = tag;
          await tagsRepository.save(newTag);
          post.tags = [newTag];
          // post.tags = [...post.tags, newTag];
        } else {
          post.tags = [preTag];
        }
      });
    }

    const information = new PostInformation();
    const metadata = new PostMetadata();
    post.information = information;
    post.metadata = metadata;

    // await postInformationRepository.save(information);
    // await postMetadataRepository.save(metadata);
    // await postRepository.save(post);

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
}

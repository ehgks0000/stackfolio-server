import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { Tag } from 'src/tags/entity/tag.entity';
import { TagRepository } from 'src/tags/repository/tag.repository';
import { User } from 'src/users/entity/user.entity';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entity/post.entity';
// import { PostLikeRepository } from './repository/post-like.repository';
import { PostRepository } from './repository/post.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    // private readonly postLikeRepository: PostLikeRepository,
    private readonly tagRepository: TagRepository,
    private readonly filesService: FilesService,
  ) {}

  async createPost(userId: string, data: CreatePostDto): Promise<Post> {
    const post = await this.postRepository.createPost(userId, data);
    return post;
  }

  //전체 게시글 & is_private = false 인것만
  async getPostsAll(): Promise<Post[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.user_like', 'user_like')
      .leftJoinAndSelect('post.metadata', 'metadata')
      .where('metadata.is_private = false')
      .orderBy('post.created_at', 'DESC')
      .getMany();
    console.log('post all');

    return posts;
  }
  async getPostsOfMy(userId: string): Promise<Post[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.user_like', 'user_like')
      .leftJoinAndSelect('post.metadata', 'metadata')
      .where('post.user_id= :userId', { userId: userId })
      .orderBy('post.created_at', 'DESC')
      .getMany();
    return posts;
  }

  // 유저의 post 불러오기
  // public인것만
  // 전체공개 (is_private = false) 인 post만 불러오기
  async getPostsByUserId(
    userId: string,
    // includePrivate = false,
  ): Promise<Post[]> {
    // const posts = await this.postRepository.find({
    //   where: { user_id: userId },
    //   relations: ['post_metadata'],
    // });
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.metadata', 'metadata')
      .where('post.user_id= :userId', { userId: userId })
      .andWhere('metadata.is_private = false')
      .getMany();

    // console.log(post);
    return posts;
  }
  // postid의 post 불러오기
  // public인 것만
  async getPostByPostId(postId: string): Promise<Post> {
    // const posts = await this.postRepository.find({ id: postId });
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.metadata', 'metadata')
      .where('post.id = :postId', { postId: postId })
      .andWhere('metadata.is_private = false')
      .getOne();

    return post;
  }

  async updatePost(
    userId: string,
    postId: string,
    data: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postRepository.updatePost(userId, postId, data);

    return post;
  }

  async deletePost(userid: string, postId: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      id: postId,
      user_id: userid,
    });

    await this.postRepository.remove(post);
    return post;
  }

  //   async getLikePosts(userId: string) {
  //     const posts = this.userRepository.findOne({ id: userId });
  //     return { posts } as any;
  //   }

  async likePost(me: User, postId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user_like'],
    });
    post.user_like_ids.forEach((id) => {
      if (id === me.id) {
        throw new BadRequestException('이미 좋아요 했습니다.');
      }
    });
    post.user_like = [...post.user_like, me];

    // await this.userRepository.save(user);
    await this.postRepository.save(post);
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user_like'],
    });
    post.user_like = post.user_like.filter((user) => {
      user.id !== userId;
    });

    await this.postRepository.save(post);
  }

  //test createTags
  //   async createTag(
  //     userId: string,
  //     postId: string,
  //     data: CreateTagDto,
  //   ): Promise<Tag> {
  //     const tag = await this.tagRepository.createTag(userId, postId, data);
  //     return tag;
  //   }

  async getTags(): Promise<Tag[] | undefined> {
    const tags = await this.tagRepository.find();
    return tags;
  }

  async uploadThumbnail(
    userId: string,
    postId: string,
    buffer: Buffer,
    originalname: string,
  ): Promise<string> {
    // const { buffer, originalname } = files.thumbnail;
    const key = `${postId}`;
    return this.filesService.uploadFile(key, buffer, originalname);
  }

  async uploadContentImages(
    userId: string,
    postId: string,
    buffer: Buffer,
    originalname: string,
  ): Promise<string> {
    const key = `${originalname}`;
    return this.filesService.uploadFile(key, buffer, originalname);
  }

  async deleteThumbnail(userId: string, postId: string): Promise<void> {
    const post = await this.postRepository.findOne(
      {
        id: postId,
        user_id: userId,
      },
      { relations: ['information'] },
    );

    if (post.information.thumbnail) {
      await this.filesService.deleteFile(post.information.thumbnail);

      post.information.thumbnail = null;
      await this.postRepository.save(post);
    }
    // return post;
  }
  async deleteContentImages(): Promise<any> {
    return;
  }
}

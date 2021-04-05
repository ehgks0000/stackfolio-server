import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entity/tag.entity';
import { TagRepository } from 'src/tags/repository/tag.repository';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entity/post.entity';
import { PostLikeRepository } from './repository/post-like.repository';
import { PostRepository } from './repository/post.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostRepository,
    private readonly postLikeRepository: PostLikeRepository,

    private readonly tagRepository: TagRepository,
  ) {}

  async createPost(userId: string, data: CreatePostDto): Promise<Post> {
    const post = await this.postRepository.createPost(userId, data);
    return post;
  }

  async getPostsAll(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ['tags'],
      order: { created_at: 'DESC' },
    });
    // posts
    console.log('post all');

    return posts;
  }

  // 유저의 post 불러오기
  async getPosts(userId: string, includePrivate = false): Promise<Post[]> {
    const post = await this.postRepository.find({ user_id: userId });
    // console.log(post);
    return post;
  }
  // postid의 post 불러오기
  async getPost(postId: string): Promise<Post[]> {
    const post = await this.postRepository.find({ id: postId });
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

  async likePost(userId: string, postId: string): Promise<void> {
    this.postLikeRepository.createPostLike(userId, postId);
    // return {} as any;
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    const unlikePost = await this.postLikeRepository.findOne({
      user_id: userId,
      post_id: postId,
    });

    await this.postLikeRepository.remove(unlikePost);
    // return {} as any;
  }

  //test createTags
  async createTag(): Promise<Tag> {
    const tag = await this.tagRepository.createTag('test tag');
    return tag;
  }

  async getTags(): Promise<Tag[] | undefined> {
    const tags = await this.tagRepository.find();
    return tags;
  }
}

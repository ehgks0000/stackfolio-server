import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { getConnection } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserProfile } from './entity/user-profile.entity';
import { User } from './entity/user.entity';
import { UserFavoriteRepository } from './repository/user-favorite.repository';
import { UserProfileRepository } from './repository/user-profile.repository';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly userFavoriteRepository: UserFavoriteRepository,
    private readonly userProfileRepository: UserProfileRepository, // private readonly userFollowerRepository: Repository<Follow>,
    private readonly filesService: FilesService,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async deleteUser(user: User): Promise<User> {
    await this.userRepository.delete(user.id);
    return user;
  }

  async getMyUser(user_id: string): Promise<any> {
    // const user = await this.userRepository.findOne({ id: user_id });
    const profile = await this.userProfileRepository
      .createQueryBuilder('user_profile')
      .leftJoinAndSelect('user_profile.user', 'user')
      .leftJoinAndSelect('user.posts', 'posts')
      .leftJoinAndSelect('user.questions', 'questions')
      //   .leftJoinAndSelect('posts.tags', 'tags')
      .where('user.id = :id', { id: user_id })
      .getOne();

    //post 태그 목록만 불러옴
    // question 태그 목록은?
    //유저의 리스트 목록 들에서 태그를 뽑는다.
    const ttt = [];
    // const ttt: tagInterface[] = [];
    profile.user.posts.forEach((post) => {
      post.tag_id.forEach((tag) => {
        // ttt.push({ tag: tag, count: 1 });
        ttt.push(tag);
      });
    });

    profile.user.questions.forEach((question) => {
      question.tag_id.forEach((tag) => {
        ttt.push(tag);
      });
    });

    // 뽑은 태그 숫자를 만듬
    const tagJson = ttt.reduce((acc, curr) => {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
      return acc;
    }, {});

    //JSON을 Array로 바꿔서 정렬
    const tagArray = [];
    for (const c in tagJson) {
      tagArray.push([c, tagJson[c]]);
    }
    tagArray.sort((a, b) => {
      return b[1] - a[1];
    });

    return { profile, tags: tagArray };
  }

  async getUserProfile(user_id: string): Promise<UserProfileResponseDto> {
    try {
      //   const user = await this.userRepository.findOne(user_id, {
      //     relations: ['followers', 'following', 'posts'],
      //   });
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'user_profile')
        .leftJoinAndSelect('user.followers', 'followers')
        .leftJoinAndSelect('user.following', 'following')
        .leftJoinAndSelect('user.posts', 'posts')
        .where('user.id = :id', { id: user_id })
        .getOne();

      //   console.log('유저의 프로필', user);

      //   const user = await this.userRepository.findOne({
      //     where: { id: user_id },
      //     relations: ['followers', 'following', 'posts'],
      //   });
      if (!user) {
        throw new Error();
      }

      return {
        profile: user.profile,
        followers: user.followers.length,
        followers_: user.followers,
        following: user.following.length,
        following_: user.following,
        posts: user.posts.length,
      };
    } catch (err) {
      // the `findOne` method throws an error if the provided `user_id` is not a `uuid`
      throw new BadRequestException('Invalid user_id');
    }
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserProfile> {
    const userProfile = await this.userProfileRepository.findOne({
      user_id: userId,
    });
    const { username, bio, about, avatar, social_links } = data;
    userProfile.username = username;
    userProfile.bio = bio;
    userProfile.about = about;
    userProfile.avatar = avatar;
    userProfile.social_links = social_links;
    // userProfile = {
    //   ...userProfile,
    //   ...data,
    // };
    try {
      const updatedUserProfile = await this.userProfileRepository.save(
        userProfile,
      );
      return updatedUserProfile;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username conflict');
      }
    }
  }

  // 내 팔로워들 보기
  async getFollowers(userId: string): Promise<User[]> {
    const user = await this.userRepository.findOne(
      { id: userId },
      { relations: ['followers'] },
    );
    if (!user) {
      throw new BadRequestException('User does not exist.');
    }
    return user.followers;
  }

  // 내 팔로잉들 보기
  async getFollowings(userId: string): Promise<User[]> {
    const user = await this.userRepository.findOne(
      { id: userId },
      { relations: ['following'] },
    );
    if (!user) {
      throw new BadRequestException('User does not exist.');
    }
    return user.following;
  }

  // 팔로잉하기
  async follow(me: string, userId: string): Promise<void> {
    // console.log('나', me);
    // console.log('팔로할사람', userId);
    if (me === userId) {
      throw new BadRequestException('Unable to follow yourself.');
    }
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['following'],
      });
      //   { id: userId },
      //     { relations: ['following'] },
      const my = await this.userRepository.findOne({ id: me });
      //   console.log('마이마이:', my);
      //   console.log('유저:', user);
      if (!user) {
        throw new BadRequestException('없는 회원입니다!');
      }
      user.followers = [my];
      this.userRepository.save(user);
    } catch (err) {
      // the `findOne` method throws an error if the provided `user_id` is not a `uuid`
      console.log(err);
      throw new BadRequestException('Invalid user_id', err);
    }
  }

  // 팔로잉 끊기 (언팔)
  async unFollow(myId: string, userId: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne(
        { id: userId },
        { relations: ['following', 'followers'] },
      );
      if (!user) {
        throw new Error();
      }
      user.followers = user.followers.filter(
        (follower) => follower.id !== myId,
      );
      await this.userRepository.save(user);
    } catch (err) {
      // the `findOne` method throws an error if the provided `user_id` is not a `uuid`
      throw new BadRequestException('Invalid user_id');
    }
  }
  async addAvatar(
    userId: string,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<UserProfile> {
    const userProfile = await this.userProfileRepository.findOne({
      user_id: userId,
    });

    if (!userProfile) {
      throw new BadRequestException('유저가 로그인 안되어있습니다!');
    }
    const avatar = await this.filesService.uploadFile(
      userId,
      imageBuffer,
      filename,
    );

    userProfile.avatar = avatar;

    await this.userProfileRepository.save(userProfile);
    return userProfile;
  }

  async deleteAvatar(userId: string): Promise<void> {
    const userProfile = await this.userProfileRepository.findOne({
      user_id: userId,
    });
    if (!userProfile.avatar) {
      throw new BadRequestException('');
    }
    await this.filesService.deleteFile(userProfile.avatar);

    userProfile.avatar = null;
    await this.userProfileRepository.save(userProfile);
  }

  // // 팔로워 끊기
  // async unFollower(myId: string, userId: string): Promise<User[]> {
  //   const user = await this.userRepository.findOne(
  //     { id: userId },
  //     { relations: ['following', 'followers'] },
  //   );
  //   if (!user) {
  //     throw new BadRequestException('User does not exist.');
  //   }
  //   user.following = user.following.filter(
  //     (following) => following.id !== myId,
  //   );
  //   await this.userRepository.save(user);
  //   // user.removeFollowers(myId);

  //   return user.following;
  // }

  // async getFavorites(user_id: string): Promise<Favorite[]> {
  //   const favorites = await this.userFavoriteRepository.find({ user_id });
  //   return favorites;
  // }

  // async addFavorite(user_id: string, post_id: string): Promise<Favorite> {
  //   const favorites = await this.userFavoriteRepository.createFavorite(
  //     user_id,
  //     post_id,
  //   );

  //   return favorites;
  // }

  // async deleteFavorite(
  //   user_id: string,
  //   favorite_id: string,
  // ): Promise<Favorite> {
  //   try {
  //     const favorite = await this.userFavoriteRepository.findOne({
  //       id: favorite_id,
  //     });

  //     await this.userFavoriteRepository.remove(favorite);

  //     return favorite;
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException();
  //   }
  // }
}

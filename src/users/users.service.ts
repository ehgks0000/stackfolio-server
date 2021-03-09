import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { Favorite } from './entity/user-favorite.entity';
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
  ) {}

  async deleteUser(user: User): Promise<User> {
    await this.userRepository.delete(user.id);
    return user;
  }

  async getUserProfile(user_id: string): Promise<UserProfileResponseDto> {
    try {
      const user = await this.userRepository.findOne(user_id, {
        relations: ['followers', 'following', 'posts'],
      });
      if (!user) {
        throw new Error();
      }
      return {
        profile: user.profile,
        followers: user.followers.length,
        following: user.following.length,
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
    let userProfile = await this.userProfileRepository.findOne({
      user_id: userId,
    });
    userProfile = {
      ...userProfile,
      ...data,
    };
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
  async follow(me: User, userId: string): Promise<void> {
    if (me.id === userId) {
      throw new BadRequestException('Unable to follow yourself.');
    }
    try {
      const user = await this.userRepository.findOne(
        { id: userId },
        { relations: ['following'] },
      );
      if (!user) {
        throw new Error();
      }
      user.followers = [me];
      this.userRepository.save(user);
    } catch (err) {
      // the `findOne` method throws an error if the provided `user_id` is not a `uuid`
      throw new BadRequestException('Invalid user_id');
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

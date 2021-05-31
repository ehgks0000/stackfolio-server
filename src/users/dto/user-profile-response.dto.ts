import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '../entity/user-profile.entity';
import { User } from '../entity/user.entity';

export class UserProfileResponseDto {
  @ApiProperty()
  profile: UserProfile;

  @ApiProperty()
  followers: number;

  @ApiProperty()
  followers_: User['followers'];

  @ApiProperty()
  following: number;

  @ApiProperty()
  following_: User['following'];

  @ApiProperty()
  posts: number;
}

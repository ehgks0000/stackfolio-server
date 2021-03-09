import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '../entity/user-profile.entity';

export class UserProfileResponseDto {
  @ApiProperty()
  profile: UserProfile;

  @ApiProperty()
  followers: number;

  @ApiProperty()
  following: number;

  @ApiProperty()
  posts: number;
}

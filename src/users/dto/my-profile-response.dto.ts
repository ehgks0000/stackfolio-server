import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/users/entity/user-profile.entity';

export class MyProfileResponseDto {
  @ApiProperty()
  profile: UserProfile;

  @ApiProperty()
  tags: string[];
}

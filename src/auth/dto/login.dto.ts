import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/users/entity/user-profile.entity';

export class LoginDto {
  @ApiProperty()
  profile: UserProfile;

  @ApiProperty()
  accessToken: string;
}

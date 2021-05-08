import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { Post } from '../entity/post.entity';

export class PostByUserResponseDto {
  @ApiProperty()
  author: UserProfile['username'];

  @ApiProperty()
  posts: Post[];
}

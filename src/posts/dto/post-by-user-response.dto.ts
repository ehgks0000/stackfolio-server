import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { User } from 'src/users/entity/user.entity';
import { Post } from '../entity/post.entity';

type ttt = {
  id: string;
};
export class PostByUserResponseDto {
  @ApiProperty()
  //   author: string;
  author: UserProfile;
  //   author: UserProfile['username'];
  //   author: User;

  //   @ApiProperty()
  @ApiProperty({ isArray: true })
  posts: Post;
  //   posts: ttt;
}

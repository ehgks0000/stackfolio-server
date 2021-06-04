import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
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
  //   @IsObject({ each: true })
  //   posts: Post[];
  @ApiProperty({ isArray: true })
  posts: Post;
}

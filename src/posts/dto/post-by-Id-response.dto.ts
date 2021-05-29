import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { Post } from '../entity/post.entity';

export class PostByIdResponseDto {
  @ApiProperty()
  author: UserProfile['username'];

  @ApiProperty()
  post: Post;

  @ApiProperty()
  seriesId: string;

  @ApiProperty()
  tagNames: string[];

  @ApiProperty()
  seriesName: string;

  @ApiProperty()
  series: string[];
}

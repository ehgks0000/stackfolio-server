import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { Post } from '../entity/post.entity';

export class PostByIdResponseDto {
  @ApiProperty()
  author: UserProfile;

  @ApiProperty()
  //   @IsObject({ each: true })
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

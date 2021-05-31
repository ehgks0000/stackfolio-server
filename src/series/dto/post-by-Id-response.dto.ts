import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { Series } from '../entity/series.entity';

export class PostsOfSeriesResponse {
  @ApiProperty({ default: 1 })
  page: number;

  @ApiProperty({ default: 10 })
  pageSize: number;

  @ApiProperty()
  series: Series[];
}

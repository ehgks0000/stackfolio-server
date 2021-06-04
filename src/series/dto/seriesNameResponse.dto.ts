import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/users/entity/user-profile.entity';
import { Series } from '../entity/series.entity';

export class SeriesNameResponse {
  @ApiProperty({ description: '시리즈 이름입니다.' })
  seriesName: string;
}

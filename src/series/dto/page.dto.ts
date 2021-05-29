import { IsNotEmpty, IsString } from 'class-validator';

export class SeriesPagenation {
  @IsNotEmpty()
  seriesId: string;

  @IsNotEmpty()
  page = 1;

  @IsNotEmpty()
  pageSize = 10;
}

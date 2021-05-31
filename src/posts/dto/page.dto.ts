import { IsNotEmpty, IsString } from 'class-validator';

export class PostPagenation {
  @IsNotEmpty()
  page = 1;

  @IsNotEmpty()
  pageSize = 10;
}

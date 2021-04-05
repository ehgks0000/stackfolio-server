import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { Tag } from 'src/tags/entity/tag.entity';

export class CreatePostDto {
  @ApiProperty({
    description: 'post 제목입니다.',
    example: 'post 제목입니다.',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'post 내용입니다.' })
  @IsString()
  contents: string;

  @ApiProperty({ description: 'post 태그입니다.' })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
  ////////////////
  @ApiProperty({ description: 'post-information description 입니다.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'post-information thumbnail 입니다.' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ description: 'post-information slug 입니다.' })
  @IsString()
  @IsOptional()
  slug?: string;

  ////////////

  @ApiProperty({ description: 'post-metadata published 입니다.' })
  @IsString()
  @IsOptional()
  published?: string;

  @ApiProperty({ description: 'post-metadata is_private 입니다.' })
  @IsString()
  @IsOptional()
  is_private?: string;
}

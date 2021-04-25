import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Question 제목입니다.',
    example: 'Question 제목입니다.',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Question 내용입니다.' })
  @IsString()
  contents: string;

  @ApiProperty({ description: 'Question 태그입니다.' })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
  ////////////////
  @ApiProperty({ description: 'Question-information description 입니다.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Question-information thumbnail 입니다.' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ description: 'Question-information slug 입니다.' })
  @IsString()
  @IsOptional()
  slug?: string;

  ////////////

  @ApiProperty({ description: 'Question-metadata published 입니다.' })
  @IsString()
  @IsOptional()
  published?: string;

  @ApiProperty({ description: 'Question-metadata is_private 입니다.' })
  @IsString()
  @IsOptional()
  is_private?: string;

  @ApiProperty({ description: 'Question-metadata is_private 입니다.' })
  @IsString()
  @IsOptional()
  series_id?: string;
}

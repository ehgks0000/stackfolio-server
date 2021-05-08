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

  @ApiProperty({ required: false, description: 'Question 태그입니다.' })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
  ////////////////
  @ApiProperty({
    required: false,
    description: 'Question-information description 입니다.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'Question-information thumbnail 입니다.',
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    required: false,
    description: 'Question-information slug 입니다.',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  ////////////

  @ApiProperty({
    required: false,
    description: 'Question-metadata published 입니다.',
  })
  @IsString()
  @IsOptional()
  published?: string;

  @ApiProperty({
    required: false,
    description: 'Question-metadata is_private 입니다.',
  })
  @IsString()
  @IsOptional()
  is_private?: string;

  @ApiProperty({
    required: false,
    description: '시리즈 테이블, ID값 입니다.',
  })
  @IsString()
  @IsOptional()
  series_id?: string;
}

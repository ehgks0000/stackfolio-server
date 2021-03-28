import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    description: 'title of the post',
  })
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'contents of the post',
  })
  @IsString()
  contents?: string;
}

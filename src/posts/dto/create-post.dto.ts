import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'title of the post',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'contents of the post',
  })
  @IsString()
  contents: string;
}

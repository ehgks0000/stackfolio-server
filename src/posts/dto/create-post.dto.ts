import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { Tag } from 'src/tags/entity/tag.entity';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  contents: string;

  @IsString({ each: true })
  @IsOptional()
  // tags?: Tag[];
  tags?: string[];
}

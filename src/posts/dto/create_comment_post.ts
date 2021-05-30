import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCommentPostDto {
  //   @ApiProperty({
  //     required: false,
  //     description: '댓글의 id값은 필요없습니다.',
  //     type: Number,
  //   })
  //   @IsNumber()
  //   @IsOptional()
  //   id?: number;

  @ApiProperty({
    description:
      '댓글의 그룹입니다. (맨처음 댓글들 순서), 대댓글을 생성 할 경우 부모 댓글의 group가 필요합니다.',
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  group?: number;

  @ApiProperty({
    description:
      '댓글들 순서입니다. 대댓글을 생성 할 경우 부모댓글의 sorts가 필요합니다..',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  sorts?: number;

  @ApiProperty({
    description:
      '대댓글 깊이입니다. 대댓글을 생성 할 경우 부모댓글의 depth가 필요합니다.',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  depth?: number;

  @ApiProperty({
    description: '댓글 내용입니다.',
    example: '안녕하세요 댓글입니다.',
  })
  @IsString()
  contents: string;
}

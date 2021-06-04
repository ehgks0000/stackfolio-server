import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class TagNameResponseDto {
  @ApiProperty({
    description: '태그 이름입니다.',
  })
  @IsString()
  tagName: string;
}

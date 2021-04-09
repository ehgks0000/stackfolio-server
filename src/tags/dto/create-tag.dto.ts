import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: "a new Tag's title",
    example: 'JavaScript',
  })
  @IsString()
  tag: string;
}

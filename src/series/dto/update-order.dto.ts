import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'New Orders of Series',
    example: '["시리즈1 id","시리즈2 id","시리즈3 id"]',
  })
  @IsString()
  postIds: string[];
}

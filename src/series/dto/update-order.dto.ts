import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: "a new Tag's title",
    example: 'JavaScript',
  })
  @IsString({ each: true })
  post_ids: string[];
}

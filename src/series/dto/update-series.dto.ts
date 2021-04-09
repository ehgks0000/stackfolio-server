import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateSeriesDto {
  @ApiProperty({
    description: "a new Tag's title",
    example: 'JavaScript',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: "a new Tag's title",
    example: 'JavaScript',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "a new Tag's title",
    example: 'JavaScript',
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    description: "a new Tag's title",
    example: 'JavaScript',
  })
  @IsString()
  @IsOptional()
  slug?: string;
}

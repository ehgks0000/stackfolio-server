import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateSeriesDto {
  @ApiProperty({
    description: 'This is a Series Name!',
    example: 'JavaScript Study',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 'These are contents of JavaScript Study' })
  @IsEmail()
  @IsOptional()
  @Length(3, 50)
  description?: string;

  @ApiProperty({ example: 'Series Representative Image' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ required: false, example: 'This is slug' })
  @IsString()
  @IsOptional()
  slug?: string;
}

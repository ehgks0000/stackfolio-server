import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { CreateSeriesDto } from './create-series.dto';

export class UpdateSeriesDto extends PartialType(CreateSeriesDto) {
  //   @ApiProperty({
  //     description: "a new Tag's title",
  //     example: 'JavaScript',
  //   })
  //   @IsString()
  //   @IsOptional()
  //   name?: string;
  //   @ApiProperty({
  //     description: "a new Tag's title",
  //     example: 'JavaScript',
  //   })
  //   @IsString()
  //   @IsOptional()
  //   description?: string;
  //   @ApiProperty({
  //     description: "a new Tag's title",
  //     example: 'JavaScript',
  //   })
  //   @IsString()
  //   @IsOptional()
  //   thumbnail?: string;
  //   @ApiProperty({
  //     description: "a new Tag's title",
  //     example: 'JavaScript',
  //   })
  //   @IsString()
  //   @IsOptional()
  //   slug?: string;
}

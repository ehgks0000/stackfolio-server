import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, Length } from 'class-validator';
import { SocialLinks } from '../entity/user-profile.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @Length(3, 50)
  @IsOptional()
  username?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  social_links?: SocialLinks;

  //   @ApiProperty({ required: false })
  //   @IsObject()
  //   @IsOptional()
  //   exp?: number;

  //   @ApiProperty({ required: false })
  //   @IsObject()
  //   @IsOptional()
  //   level?: number;
}

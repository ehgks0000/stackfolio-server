import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, Length } from 'class-validator';
import { SocialLinks } from '../entity/user-profile.entity';
import { CreateUserDto } from './create-user.dto';

export class UserNameResponseDto {
  @ApiProperty({ description: '유저이름 입니다.' })
  //   @IsString()
  userName: string;
}

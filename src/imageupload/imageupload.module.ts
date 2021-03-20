import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileRepository } from '../users/repository/user-profile.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { ImageuploadController } from './imageupload.controller';
import { ImageuploadService } from './imageupload.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfileRepository, UserRepository])],
  controllers: [ImageuploadController],
  providers: [ImageuploadService],
  exports: [ImageuploadService, TypeOrmModule],
})
export class ImageuploadModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfileRepository])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

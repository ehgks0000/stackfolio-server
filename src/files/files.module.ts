import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

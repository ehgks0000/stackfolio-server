import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadAvatarFile(userId: string, dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        ACL: 'public-read',
        Bucket: this.configService.get('aws.bucketname'),
        ContentType: 'image/png',
        Metadata: {
          fieldname: 'image',
        },
        Body: dataBuffer,
        Key: `${userId}`,
      })
      .promise();
    // const newFile = this.FilesRepository.create({
    //   key: uploadResult.Key,
    //   url: uploadResult.Location,
    // });
    return uploadResult.Location;
  }
}

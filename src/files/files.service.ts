import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(
    Key: string,
    dataBuffer: Buffer,
    filename: string,
  ): Promise<string> {
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
        Key,
      })
      .promise();
    return uploadResult.Location;
  }

  async deleteFile(Url: string): Promise<void> {
    if (!Url) {
      throw new BadRequestException('URL이 존재하지 않습니다!');
    }
    const url = Url.split('/');
    const delFileName = url[url.length - 1];

    const s3 = new S3();
    s3.deleteObject({
      Bucket: this.configService.get<string>('aws.[bucketname]'),
      Key: delFileName,
    })
      .promise()
      .then(() => console.log('성공'))
      .catch((e) => console.error('에러', e));
  }
}

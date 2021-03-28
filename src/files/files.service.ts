import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

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

  async deleteAvatarFile(avatar: string): Promise<void> {
    // const userProfile = await this.userProfileRepository.findOne({
    //   user_id: userId,
    // });
    // console.log('avatar : ', userProfile);

    if (!avatar) {
      throw new BadRequestException('유저프로파일에 아바타가 없습니다!');
    }
    const url = avatar.split('/');
    const delFileName = url[url.length - 1];

    const s3 = new S3();
    s3.deleteObject({
      Bucket: this.configService.get<string>('aws.[bucketname]'),
      Key: delFileName,
    }).promise();
  }
}

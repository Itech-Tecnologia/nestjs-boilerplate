import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import { diskStorage, StorageEngine } from 'multer';
import * as multerS3 from 'multer-s3';
import { resolve } from 'path';

@Injectable()
export class StorageProvider {
  private readonly s3: S3 | null;
  public readonly localStorage: StorageEngine;
  public readonly s3Storage: StorageEngine | null;

  constructor(private readonly configService: ConfigService) {
    this.localStorage = diskStorage({
      destination: resolve(process.env.PWD, 'tmp', 'uploads'),
      filename: this.generateKeyOrFilename,
    });

    if (configService.get('MULTER_DISK') === 's3') {
      this.s3 = new S3({
        accessKeyId: this.configService.get('S3_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET'),
        region: this.configService.get('S3_REGION'),
      });

      this.s3Storage = multerS3({
        s3: this.s3,
        bucket: this.configService.get('S3_BUCKET'),
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: this.configService.get('S3_ACL'),
        key: this.generateKeyOrFilename,
      });
    }
  }

  private generateKeyOrFilename(
    request: Request,
    file: Express.Multer.File | Express.MulterS3.File,
    callback: (error: any, keyOrFilename?: string) => void,
  ): void {
    const hash = randomBytes(10).toString('hex');

    const filename = `${hash}-${file.originalname}`;

    callback(null, filename);
  }
}

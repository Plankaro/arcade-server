import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';
import { filter, isEmpty } from 'lodash';
import { Image } from 'src/dto/image.dto';

@Injectable()
export class CloudinaryService {
  uploadFiles(
    files: Image[] | Image,
  ): Promise<UploadApiResponse[] | UploadApiErrorResponse[]> | [] {
    if (isEmpty(files)) {
      return [];
    }
    files = Array.isArray(files) ? files : [files];
    return Promise.all(
      filter(files, (value) => !!value).map((file) => {
        const { name, data } = file;
        const base64String = data.split(',')[1];
        const buffer = Buffer.from(base64String, 'base64');
        return new Promise<UploadApiResponse>((resolve, reject) => {
          const date = new Date().getTime();
          const splitName = name.split('.');
          splitName.pop();
          const tempName = splitName.join('.');
          const finalName = `${tempName}-${date}`;
          const upload = cloudinary.uploader.upload_stream(
            {
              folder: 'nest-cloudinary',
              unique_filename: true,
              access_mode: 'public',
              use_filename: true,
              public_id: finalName,
              filename_override: finalName,
              exif: true,
            },
            (err, callResult) => {
              if (callResult) {
                resolve(callResult);
              } else {
                reject(err);
              }
            },
          );

          this.bufferToStream(buffer).pipe(upload);
        });
      }),
    );
  }

  private bufferToStream(buffer: Buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}

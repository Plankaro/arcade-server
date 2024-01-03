import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY' as const;

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dhypvhqb5',
      api_key: '676826547578292',
      api_secret: '1Ft9OsPTrPqcCcsWjGEVbjEEv4M',
    });
  },
};

import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { CludionaryResponse, TUploadedFileInfo } from '../app/interfaces/file';

cloudinary.config({
  cloud_name: 'daxj3l4ed',
  api_key: '597623775953897',
  api_secret: '4LbvXjc3Vl2EBe3P6HrQ3NRSf0Q',
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploadToCludionary = async (
  file: TUploadedFileInfo
): Promise<CludionaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      // { public_id: 'ph-health-care' },
      (error: Error, result: CludionaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const upload = multer({ storage: storage });

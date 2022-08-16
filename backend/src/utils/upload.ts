import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const uploadPath = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  directory: uploadPath,
  storage: multer.diskStorage({
    destination: uploadPath,
    filename(_req, file, callback) {
      const hash = crypto.randomBytes(10).toString('hex');
      const filename = `${hash}-${file.originalname}`;
      callback(null, filename);
    },
  }),
};

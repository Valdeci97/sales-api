import multer from 'multer';
import CustomRouter from '.';
import AvatarController from '../controllers/AvatarController';
import TokenMiddleware from '../middlewares/Token';
import uploadConfig from '../utils/upload';

const avatarController = new AvatarController();
const tokenMiddleware = new TokenMiddleware();
const avatarRouter = new CustomRouter();
const upload = multer(uploadConfig);

avatarRouter.addPatchRoute(
  '/users/avatar',
  avatarController.update,
  tokenMiddleware.validate,
  upload.single('fileName')
);

export default avatarRouter;

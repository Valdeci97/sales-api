import multer from 'multer';

import CustomRouter from './routes';
import App from './app';

import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';
import LoginController from './controllers/LoginController';
import AvatarController from './controllers/AvatarController';

import GuidMiddleware from './middlewares/GuidMiddleware';
import ProductMiddleware from './middlewares/ProductMiddleware';
import UserMiddleware from './middlewares/UserMiddleware';
import TokenMiddleware from './middlewares/Token';

import uploadConfig from './utils/upload';

const server = new App();
const guidMiddleware = new GuidMiddleware();

const productController = new ProductController();
const productMiddleware = new ProductMiddleware();
const productRouter = new CustomRouter();

const tokenMiddleware = new TokenMiddleware();

productRouter.addGetRoute(productController.route, productController.read);

productRouter.addGetRoute(
  `${productController.route}/:id`,
  productController.readOne,
  guidMiddleware.validateGuid
);

productRouter.addPostRoute(
  productController.route,
  productController.create,
  productMiddleware.validateName,
  productMiddleware.validatePrice,
  productMiddleware.validateQuantity
);

productRouter.addPutRoute(
  `${productController.route}/:id`,
  productController.update,
  productMiddleware.validateName,
  productMiddleware.validatePrice,
  productMiddleware.validateQuantity,
  guidMiddleware.validateGuid
);

productRouter.addDeleteRoute(
  `${productController.route}/:id`,
  productController.delete,
  guidMiddleware.validateGuid
);

const userController = new UserController();
const userMiddleware = new UserMiddleware();
const userRouter = new CustomRouter();

userRouter.addGetRoute(userController.route, userController.read);

userRouter.addGetRoute(
  `${userController.route}/:id`,
  userController.readOne,
  guidMiddleware.validateGuid
);

userRouter.addPostRoute(
  userController.route,
  userController.create,
  userMiddleware.validateName,
  userMiddleware.validateEmail,
  userMiddleware.validatePassword
);

userRouter.addPatchRoute(
  `${userController.route}/:id/name`,
  userController.update,
  guidMiddleware.validateGuid,
  tokenMiddleware.validate,
  userMiddleware.validateName
);

userRouter.addDeleteRoute(
  `${userController.route}/:id`,
  userController.delete,
  guidMiddleware.validateGuid,
  tokenMiddleware.validate
);

const loginController = new LoginController();
const loginRouter = new CustomRouter();

loginRouter.addPostRoute(
  '/login',
  loginController.login,
  userMiddleware.validateEmail
);

const avatarController = new AvatarController();
const avatarRouter = new CustomRouter();
const upload = multer(uploadConfig);

avatarRouter.addPatchRoute(
  '/users/avatar',
  avatarController.update,
  tokenMiddleware.validate,
  upload.single('fileName')
);

server.addRouter(productRouter.router);
server.addRouter(userRouter.router);
server.addRouter(loginRouter.router);
server.addRouter(avatarRouter.router);

server.addStaticRoute('/files', uploadConfig.directory);

server.addErrorMiddleware();

export default server;

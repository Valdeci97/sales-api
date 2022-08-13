import CustomRouter from './routes';
import App from './app';
import ProductController from './controllers/ProductController';
import GuidMiddleware from './middlewares/GuidMiddleware';
import ProductMiddleware from './middlewares/ProductMiddleware';
import UserController from './controllers/UserController';
import UserMiddleware from './middlewares/UserMiddleware';
import LoginController from './controllers/LoginController';
import TokenMiddleware from './middlewares/token';

const server = new App();
const guidMiddleware = new GuidMiddleware();

const productController = new ProductController();
const productMiddleware = new ProductMiddleware();
const productRouter = new CustomRouter();

const tokenMiddleware = new TokenMiddleware();

productRouter.addGetRoute(
  productController.route,
  productController.read,
  tokenMiddleware.validate
);

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

userRouter.addPutRoute(
  `${userController.route}/:id`,
  userController.update,
  userMiddleware.validateName
);

userRouter.addDeleteRoute(
  `${userController.route}/:id`,
  userController.delete,
  guidMiddleware.validateGuid
);

const loginController = new LoginController();
const loginRouter = new CustomRouter();

loginRouter.addPostRoute('/login', loginController.login);

server.addRouter(productRouter.router);
server.addRouter(userRouter.router);
server.addRouter(loginRouter.router);

server.addErrorMiddleware();

export default server;

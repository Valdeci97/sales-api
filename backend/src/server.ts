import CustomRouter from './routes';
import App from './app';
import ProductController from './controllers/ProductController';
import GuidMiddleware from './middlewares/GuidMiddleware';
import ProductMiddleware from './middlewares/ProductMiddleware';
import { Product } from './types/ProductType';
import UserController from './controllers/UserController';
import { User } from './types/UserType';

const server = new App();
const guidMiddleware = new GuidMiddleware();

const productController = new ProductController();
const productMiddleware = new ProductMiddleware();
const productRouter = new CustomRouter<Product>();

productRouter.addGetRoute(productController.route, productController.read);

productRouter.readOneRoute(
  productController,
  productController.route,
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
const userRouter = new CustomRouter<User>();

userRouter.addGetRoute(userController.route, userController.read);

userRouter.readOneRoute(userController);

userRouter.addPostRoute(userController.route, userController.create);

userRouter.addPutRoute(`${userController.route}/:id`, userController.update);

userRouter.addDeleteRoute(`${userController.route}/:id`, userController.delete);

server.addRouter(productRouter.router);
server.addRouter(userRouter.router);

server.addErrorMiddleware();

export default server;

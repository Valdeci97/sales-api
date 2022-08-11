import CustomRouter from './routes';
import App from './app';
import ProductController from './controllers/ProductController';
import GuidMiddleware from './middlewares/GuidMiddleware';
import ProductMiddleware from './middlewares/ProductMiddleware';
import { Product } from './types/ProductType';

const server = new App();
const guidMiddleware = new GuidMiddleware();

const productController = new ProductController();
const productMiddleware = new ProductMiddleware();

const productRouter = new CustomRouter<Product>();
productRouter.readRoute(productController);

productRouter.readOneRoute(
  productController,
  productController.route,
  guidMiddleware.validateGuid
);

productRouter.createRoute(
  productController,
  productController.route,
  productMiddleware.validateName,
  productMiddleware.validatePrice,
  productMiddleware.validateQuantity
);

productRouter.updateRoute(
  productController,
  productController.route,
  productMiddleware.validateName,
  productMiddleware.validatePrice,
  productMiddleware.validateQuantity,
  guidMiddleware.validateGuid
);

productRouter.deleteRoute(
  productController,
  productController.route,
  guidMiddleware.validateGuid
);

server.addRouter(productRouter.router);

server.addErrorMiddleware();

export default server;

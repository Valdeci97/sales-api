import ProductController from '../controllers/ProductController';
import CustomRouter from '.';
import ProductMiddleware from '../middlewares/ProductMiddleware';
import GuidMiddleware from '../middlewares/GuidMiddleware';

const productController = new ProductController();
const productMiddleware = new ProductMiddleware();
const guidMiddleware = new GuidMiddleware();
const productRouter = new CustomRouter();

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

export default productRouter;

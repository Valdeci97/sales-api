import ProductController from '../controllers/ProductController';
import CustomRouter from '.';
import ProductMiddleware from '../middlewares/ProductMiddleware';
import GuidMiddleware from '../middlewares/GuidMiddleware';

const productController = new ProductController();
const productMiddleware = new ProductMiddleware();
const guidMiddleware = new GuidMiddleware();
const productRouter = new CustomRouter();

// To-Do: verificar depois se há a necessidade de adicionar validação de token.

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
  guidMiddleware.validateGuid,
  productMiddleware.validateName,
  productMiddleware.validatePrice,
  productMiddleware.validateQuantity
);

productRouter.addDeleteRoute(
  `${productController.route}/:id`,
  productController.delete,
  guidMiddleware.validateGuid
);

export default productRouter;

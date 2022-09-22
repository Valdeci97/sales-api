import CustomRouter from '.';
import OrderController from '../controllers/OrderController';
import GuidMiddleware from '../middlewares/GuidMiddleware';
import OrderMiddleware from '../middlewares/OrderMiddleware';
import TokenMiddleware from '../middlewares/Token';

const orderRouter = new CustomRouter();
const orderController = new OrderController();
const guidMiddleware = new GuidMiddleware();
const tokenMiddleware = new TokenMiddleware();
const orderMiddleware = new OrderMiddleware();

orderRouter.addPostRoute(
  '/orders',
  orderController.create,
  tokenMiddleware.validate,
  orderMiddleware.validateCustomerId,
  orderMiddleware.validateProductsArray
);

orderRouter.addGetRoute(
  '/orders/all/:id',
  orderController.read,
  tokenMiddleware.validate
);

orderRouter.addGetRoute(
  '/orders/:id',
  orderController.readById,
  tokenMiddleware.validate,
  guidMiddleware.validateGuid
);

orderRouter.addDeleteRoute(
  '/orders/:id',
  orderController.delete,
  tokenMiddleware.validate
);

export default orderRouter;

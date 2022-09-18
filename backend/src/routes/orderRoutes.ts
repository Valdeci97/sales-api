import CustomRouter from '.';
import OrderController from '../controllers/OrderController';
import GuidMiddleware from '../middlewares/GuidMiddleware';
import TokenMiddleware from '../middlewares/Token';

const orderRouter = new CustomRouter();
const orderController = new OrderController();
const guidMiddleware = new GuidMiddleware();
const tokenMiddleware = new TokenMiddleware();

orderRouter.addPostRoute(
  '/orders',
  orderController.create,
  tokenMiddleware.validate
);
orderRouter.addGetRoute(
  '/orders/:id',
  orderController.read,
  tokenMiddleware.validate,
  guidMiddleware.validateGuid
);

export default orderRouter;

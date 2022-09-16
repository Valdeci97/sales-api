import CustomRouter from '.';
import OrderController from '../controllers/OrderController';
import GuidMiddleware from '../middlewares/GuidMiddleware';

const orderRouter = new CustomRouter();
const orderController = new OrderController();
const guidMiddleware = new GuidMiddleware();

orderRouter.addPostRoute('/orders', orderController.create);
orderRouter.addGetRoute(
  '/orders/:id',
  orderController.read,
  guidMiddleware.validateGuid
);

export default orderRouter;

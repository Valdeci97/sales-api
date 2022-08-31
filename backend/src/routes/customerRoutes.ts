import CustomRouter from '.';
import CustomerController from '../controllers/CustomerController';
import GuidMiddleware from '../middlewares/GuidMiddleware';

const customerController = new CustomerController();
const guidMiddleware = new GuidMiddleware();
const customerRouter = new CustomRouter();

customerRouter.addGetRoute(customerController.route, customerController.read);
customerRouter.addGetRoute(
  `${customerController.route}/:id`,
  customerController.readOne,
  guidMiddleware.validateGuid
);
customerRouter.addPostRoute(
  customerController.route,
  customerController.create
);
customerRouter.addPutRoute(
  `${customerController.route}/:id`,
  customerController.update,
  guidMiddleware.validateGuid
);
customerRouter.addDeleteRoute(
  `${customerController.route}/:id`,
  customerController.delete,
  guidMiddleware.validateGuid
);

export default customerRouter;

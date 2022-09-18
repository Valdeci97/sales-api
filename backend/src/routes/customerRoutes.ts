import CustomRouter from '.';
import CustomerController from '../controllers/CustomerController';
import GuidMiddleware from '../middlewares/GuidMiddleware';
import TokenMiddleware from '../middlewares/Token';
import UserMiddleware from '../middlewares/UserMiddleware';

const customerController = new CustomerController();
const guidMiddleware = new GuidMiddleware();
const customerRouter = new CustomRouter();
const userMiddleware = new UserMiddleware();
const tokenMiddleware = new TokenMiddleware();

customerRouter.addGetRoute(
  customerController.route,
  customerController.read,
  tokenMiddleware.validate
);
customerRouter.addGetRoute(
  `${customerController.route}/:id`,
  customerController.readOne,
  tokenMiddleware.validate,
  guidMiddleware.validateGuid
);
customerRouter.addPostRoute(
  customerController.route,
  customerController.create,
  tokenMiddleware.validate,
  guidMiddleware.validateBodyGuid,
  userMiddleware.validateName,
  userMiddleware.validateEmail
);
customerRouter.addPutRoute(
  `${customerController.route}/:id`,
  customerController.update,
  tokenMiddleware.validate,
  guidMiddleware.validateGuid
);
customerRouter.addDeleteRoute(
  `${customerController.route}/:id`,
  customerController.delete,
  tokenMiddleware.validate,
  guidMiddleware.validateGuid
);

export default customerRouter;

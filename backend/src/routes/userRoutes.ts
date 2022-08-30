import CustomRouter from '.';
import UserController from '../controllers/UserController';
import GuidMiddleware from '../middlewares/GuidMiddleware';
import TokenMiddleware from '../middlewares/Token';
import UserMiddleware from '../middlewares/UserMiddleware';

const userController = new UserController();
const userMiddleware = new UserMiddleware();
const guidMiddleware = new GuidMiddleware();
const tokenMiddleware = new TokenMiddleware();
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

userRouter.addPatchRoute(
  `${userController.route}/:id/update-profile`,
  userController.update,
  guidMiddleware.validateGuid,
  tokenMiddleware.validate,
  userMiddleware.validateName,
  userMiddleware.validateOptionalEmail,
  userMiddleware.validateOptionalPassword
);

userRouter.addDeleteRoute(
  `${userController.route}/:id`,
  userController.delete,
  guidMiddleware.validateGuid,
  tokenMiddleware.validate
);

export default userRouter;

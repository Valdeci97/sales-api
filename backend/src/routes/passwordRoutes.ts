import CustomRouter from '.';
import PasswordController from '../controllers/PasswordController';
import GuidMiddleware from '../middlewares/GuidMiddleware';
import UserMiddleware from '../middlewares/UserMiddleware';

const passwordController = new PasswordController();
const userMiddleware = new UserMiddleware();
const guidMiddleware = new GuidMiddleware();
const passwordRouter = new CustomRouter();

passwordRouter.addPostRoute(
  '/password/forgot',
  passwordController.generateUserToken,
  userMiddleware.validateEmail
);

passwordRouter.addPostRoute(
  '/password/reset',
  passwordController.resetPassword,
  guidMiddleware.validateBodyGuid,
  userMiddleware.validatePassword,
  userMiddleware.validatePasswordConfirm
);

export default passwordRouter;

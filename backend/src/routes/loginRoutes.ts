import CustomRouter from '.';
import LoginController from '../controllers/LoginController';
import UserMiddleware from '../middlewares/UserMiddleware';

const loginController = new LoginController();
const userMiddleware = new UserMiddleware();
const loginRouter = new CustomRouter();

loginRouter.addPostRoute(
  '/login',
  loginController.login,
  userMiddleware.validateEmail
);

export default loginRouter;

import App from './app';
import uploadConfig from './utils/upload';

import productRouter from './routes/productRoutes';
import userRouter from './routes/userRoutes';
import loginRouter from './routes/loginRoutes';
import avatarRouter from './routes/avatarRoutes';
import passwordRouter from './routes/passwordRoutes';
import customerRouter from './routes/customerRoutes';
import orderRouter from './routes/orderRoutes';

const server = new App();

server.addRouter(productRouter.router);
server.addRouter(userRouter.router);
server.addRouter(loginRouter.router);
server.addRouter(avatarRouter.router);
server.addRouter(passwordRouter.router);
server.addRouter(customerRouter.router);
server.addRouter(orderRouter.router);

server.addStaticRoute('/files', uploadConfig.directory);

server.addErrorMiddleware();

export default server;

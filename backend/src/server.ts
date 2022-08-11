import CustomRouter from './routes';
import App from './app';
import ProductController from './controllers/ProductController';
import { Product } from './types/ProductType';

const server = new App();

const productController = new ProductController();

const productRouter = new CustomRouter<Product>();
productRouter.addRoute(productController, productController.route);

server.addRouter(productRouter.router);

export default server;

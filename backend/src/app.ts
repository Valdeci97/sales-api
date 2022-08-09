import express from 'express';
import cors from 'cors';

export default class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  public start(PORT: number | string = 3001) {
    this.app.listen(PORT, () => console.log('Server running at port:', PORT));
  }
}

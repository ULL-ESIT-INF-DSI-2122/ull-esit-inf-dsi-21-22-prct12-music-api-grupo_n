import * as express from 'express';

//Default

export const defaultRouter = express.Router();

defaultRouter.all('*', (_, res) => {
  res.status(501).send('Not Implemented');
});
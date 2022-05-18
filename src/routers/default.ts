import * as express from 'express';

//Default (funciona para las rutas que no existen o no estan desarrolladas)

export const defaultRouter = express.Router();

defaultRouter.all('*', (_, res) => {
  res.status(501).send('Not Implemented');
});
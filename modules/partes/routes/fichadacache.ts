import * as express from 'express';
import { FichadaCache } from '../schemas/fichadacache';
import BaseController from '../../../core/app/basecontroller';

const controller = new BaseController(FichadaCache); 
const baseUrl = '/fichadascache';

export const Routes = express.Router();

Routes.get(`${baseUrl}`, controller.get);
Routes.get(`${baseUrl}/:id`, controller.getById);

Routes.post(`${baseUrl}`, controller.add);
Routes.put(`${baseUrl}/:id`, controller.update);
Routes.delete(`${baseUrl}/:id`, controller.delete);

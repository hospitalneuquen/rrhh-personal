import * as express from 'express';
import { Fichada } from '../schemas/fichada';
import FichadaController from '../controller/fichada';

const controller = new FichadaController(Fichada); 
const baseUrl = '/fichadas';

export const Routes = express.Router();

Routes.get(`${baseUrl}`, controller.get);
Routes.get(`${baseUrl}/:id`, controller.getById);

Routes.post(`${baseUrl}`, controller.add);
Routes.post(`${baseUrl}/fichador`, controller.addFromFichador);
Routes.put(`${baseUrl}/:id`, controller.update);
Routes.delete(`${baseUrl}/:id`, controller.delete);

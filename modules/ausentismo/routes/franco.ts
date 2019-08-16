import * as express from 'express';
import * as FrancoController from '../controller/franco';

export const Routes = express.Router();


Routes.get('/francos', FrancoController.getFrancos);

Routes.post('/francos', FrancoController.addFrancos);

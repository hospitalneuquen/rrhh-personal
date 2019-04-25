import * as express from 'express';
import AgenteController from '../controller/agente';


export const Routes = express.Router();


Routes.get('/agentes', AgenteController.getAgentes);
Routes.get('/agentes/search', AgenteController.searchAgentes);
Routes.get('/agentes/:id', AgenteController.getAgenteByID);
Routes.get('/agentes/fotos/:id', AgenteController.getImage);


Routes.post('/agentes', AgenteController.addAgente);

Routes.put('/agentes/:id', AgenteController.updateAgente);
Routes.delete('/agentes/:id', AgenteController.deleteAgente);


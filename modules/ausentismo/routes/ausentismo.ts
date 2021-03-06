import * as express from 'express';
import * as utils from '../commons/utils';

import { Types } from 'mongoose';
import { AusenciaPeriodo } from '../schemas/ausenciaperiodo';

import  * as AusentismoController from '../controller/ausentismo';
import AusenciasController from '../controller/ausencias';
import LicenciasController  from '../controller/licencias';


export const Routes = express.Router();


let middleware = async function(req, res, next ){    
    try {
        let ausentismo = await utils.parseAusentismo(req.body);
        let articulo = ausentismo.articulo;
        if (req.params.id){
            if (!Types.ObjectId.isValid(req.params.id)) return res.status(404).send();
           
            let ausentismoToUpdate:any = await AusenciaPeriodo.findById(req.params.id);
            if (!ausentismoToUpdate)return res.status(404).send();
            
            res.locals.ausentismoToUpdate = ausentismoToUpdate;
            articulo = await utils.parseArticulo(ausentismoToUpdate.articulo);
            res.locals.controller = articulo.descuentaDiasLicencia? new LicenciasController():new AusenciasController();
        }
        else{
            res.locals.controller = articulo.descuentaDiasLicencia? new LicenciasController():new AusenciasController();
        }
        res.locals.ausentismo = ausentismo;
        
        next();
    } catch (err) {
        return next(err);
    }
}

Routes.post('/ausencias', middleware, AusentismoController.addAusentismo);
Routes.post('/ausencias/sugerir', middleware, AusentismoController.sugerirDiasAusentismo);
Routes.post('/ausencias/calcular', AusentismoController.calcularAusentismo);
Routes.put('/ausencias/:id',middleware, AusentismoController.updateAusentismo);

Routes.get('/ausencias', AusentismoController.getAusentismo);
Routes.get('/ausencias/:id', AusentismoController.getAusentismoById);

Routes.get('/ausencias/indicadores/agentes/:id', AusentismoController.getIndicadoresLicenciaAgente);

Routes.delete('/ausencias/:id', middleware, AusentismoController.deleteAusentismo);



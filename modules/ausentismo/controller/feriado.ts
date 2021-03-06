import { Feriado } from '../schemas/feriado';
import * as utils from '../commons/utils';

import BaseController from '../../../core/app/basecontroller';

class FeriadoController extends BaseController {

    async add(req, res, next) {
        try {
            const obj = new Feriado({
                fecha: req.body.fecha? utils.parseDate(new Date(req.body.fecha)):null,
                descripcion: req.body.descripcion
            });
            const objNuevo = await obj.save();
            return res.json(objNuevo);
        } catch (err) {
            return next(err);
        }
    }


    async getAsEvento(req, res, next) {
        try {
            // TODO: Aplicar algun filtro por anio o similar. Ahora por defecto
            // recupera la info en un periodo de un anio hacia atras y adelante
            const thisYear = (new Date()).getFullYear();
            const fechaHasta = new Date((thisYear + 1) + "-12-31");
            const fechaDesde = new Date((thisYear - 1) + "-01-01") ;
            const pipeline = [
                { $match: { fecha: { $gte:fechaDesde, $lte:fechaHasta }}},
                { $project:
                    {
                        _id: "$_id",
                        title: { $ifNull: ['$descripcion', 'Feriado'] },
                        start: { $dateToString: { date: "$fecha", format:"%Y-%m-%d"}},
                        allDay: { $literal: true },
                        backgroundColor: "transparent",
                        textColor:'#7d7d7d',
                        type: "FERIADO",
                        ausentismoFechaDesde: { $dateToString: { date: "$fecha", format:"%Y-%m-%dT00:00:00"}},
                        ausentismoFechaHasta: { $dateToString: { date: "$fecha", format:"%Y-%m-%dT00:00:00"}},
                        startString: { $dateToString: { date: "$fecha", format:"%Y-%m-%dT00:00:00"}},
                    }
                }
            ];
            let objs = await Feriado.aggregate(pipeline)
            return res.json(objs);
        } catch (err) {
            return next(err);
        }
    }
}

export default FeriadoController; 
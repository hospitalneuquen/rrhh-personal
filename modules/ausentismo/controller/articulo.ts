// import * as utils from '../commons/utils';

import BaseController from '../../../core/app/basecontroller';

class ArticuloController extends BaseController {

    // async add(req, res, next) {
    //     try {
    //         const obj = new Feriado({
    //             fecha: req.body.fecha? utils.parseDate(new Date(req.body.fecha)):null,
    //             descripcion: req.body.descripcion
    //         });
    //         const objNuevo = await obj.save();
    //         return res.json(objNuevo);
    //     } catch (err) {
    //         return next(err);
    //     }
    // }
}

export default ArticuloController; 


// import { Articulo } from '../schemas/articulo';

// export async function getArticuloById(req, res, next) {
//     try {
//         let obj = await Articulo.findById(req.params.id);
//         return res.json(obj);
//     } catch (err) {
//         return next(err);
//     }
// }

// export async function getArticulos(req, res, next) {
//     try {
//         let query = Articulo.find({});
//         if (req.query.nombre) {
//             query.where('nombre').equals(RegExp('^.*' + req.query.nombre + '.*$', 'i'));
//         }
//         if (req.query.codigo) {
//             query.where('codigo').equals(req.query.codigo);
//         }
//         let objs = await query.sort({ codigo: 1 }).exec();
//         return res.json(objs);
//     } catch (err) {
//         return next(err);
//     }
// }


// export async function addArticulo(req, res, next) {
//     try {
//         const obj = new Articulo({
//             idInterno: req.body.idInterno,
//             codigo: req.body.codigo,
//             nombre: req.body.nombre,
//             descripcion: req.body.descripcion,
//             grupo: req.body.grupo,
//             limitado: req.body.limitado,
//             requiereInformacionAdicional: req.body.requiereInformacionAdicional,
//             tituloInformacionAdicional: req.body.tituloInformacionAdicional,
//             codigoOTI: req.body.codigoOTI,
//             diasCorridos: req.body.diasCorridos,
//             diasHabiles: req.body.diasHabiles,                    
//             descuentaDiasLicencia: req.body.descuentaDiasLicencia,
//             formulas: req.body.formulas
//         });
//         const objNuevo = await obj.save();
//         return res.json(objNuevo);
//     } catch (err) {
//         return next(err);
//     }
// }

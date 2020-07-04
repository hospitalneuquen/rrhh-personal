import BaseController from '../../../core/app/basecontroller';

const diffHistory = require("../../../packages/mongoose-audit-trail");
const expandableFields = ["codigo", "nombre", "color"];

class AuditController extends BaseController {

    models = {
        "articulos" : "Articulo",
        "feriados"  :  "Feriado"
    }

    async get(req, res, next) {
        const params = this.getQueryParams(req);
        const modelName = params['filter'].model;
        const id = params['filter'].id;
        
        diffHistory
            .getHistories(this.models[modelName], id, expandableFields)
            .then(histories => {
                return res.json(histories)
            })
            .catch(err => {return next(err)});
    }
}

export default AuditController; 

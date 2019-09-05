import { Types } from "mongoose";
import * as aqp from 'api-query-params';

import { DocumentoPDF } from "../documentos";
import { Agente } from "../../../modules/agentes/schemas/agente";

import * as utils from "../utils";

export class DocumentoAusenciasPorAgente extends DocumentoPDF {
    templateName = 'reportes/agentes-ausencias.ejs';
    outputFilename = './ausenciasporagente.pdf';

    generarCSS() {
        return '';
    }
    
    async getContextData(){
        // Recuperamos todas las opciones para el reporte (filtros, orden, etc)
        let query = aqp(this.request.query, {
            casters: {
                documentoId: val => Types.ObjectId(val),
              },
              castParams: {
                '_id': 'documentoId',
                'situacionLaboral.cargo.sector._id': 'documentoId',
                'articulos': 'documentoId'
              }
        })
        // Identificamos el campo por el cual agrupar. Si no se especifico agregamos
        // uno por defecto
        let groupField = utils.getQueryParam(query.filter, '$group');
        if (!groupField) groupField = 'situacionLaboral.cargo.sector.nombre';
        const groupCondition = { _id : `$${groupField}`, agentes: { $push: "$$ROOT" } }
        
        // Filtros para el ausentismo
        let fechaDesde = utils.getQueryParam(query.filter, 'fechaDesde'); // Format 2016-01-01
        let fechaHasta = utils.getQueryParam(query.filter, 'fechaHasta');
        let articulosIds = utils.getQueryParam(query.filter, 'articulos');
        if (articulosIds) {
            articulosIds = articulosIds.$in? articulosIds.$in: [articulosIds];
        }
        else{
            articulosIds = [];
        }
        // Preparamos las opciones de filtrado sobre el agente. Removemos filtros no requeridos
        let filterCondition = utils.cleanFilters(query.filter);
        
        // Aggregation Framework Pipeline
        let pipeline:any = [
            { $match: filterCondition || {}} ,
            { $lookup: {
                    from: "ausenciasperiodo",
                    let: { agente_id: "$_id", fecha_desde: fechaDesde, fecha_hasta: fechaHasta},
                    pipeline: 
                        [{ 
                            $match: { 
                                $expr: {
                                    $and: [ 
                                        { $eq: ["$$agente_id", "$agente.id"]}, // Join con agente id
                                        (articulosIds.length)?{ $in: ["$articulo.id", articulosIds ]}:{},
                                        { $gte: ["$fechaDesde", "$$fecha_desde"]},
                                        { $lte: ["$fechaHasta", "$$fecha_hasta"]}
                                        ]
                                    },
                                }
                            }
                        ],
                    as: "ausentismo"
                 }
            } ,
            { $group: groupCondition},
            { $sort: query.sort || { apellido: 1 }}
        ]

        let gruposAgentes = await Agente.aggregate(pipeline);
        // console.log('Resultados##############')
        
        // for(const g of gruposAgentes) {
        //     for(const a of g.agentes) console.log(a.ausentismo)
        // } 
        // let articulos = await Articulo.find((articulosIds.length)?{"_id": { $in: articulosIds }}:{}).sort({ codigo: 1});

        return { 
                gruposAgente: gruposAgentes
            }
    }



    
}
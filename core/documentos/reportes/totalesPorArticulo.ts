import { Types } from "mongoose";
import * as aqp from 'api-query-params';

import { DocumentoPDF } from "../documentos";
import { Agente } from "../../../modules/agentes/schemas/agente";
import { Articulo } from "../../../modules/ausentismo/schemas/articulo";

import * as utils from "../utils";
import config from '../../../confg';

export class DocumentoAusenciasTotalesPorArticulo extends DocumentoPDF {
    templateName = 'reportes/agentes-ausencias-por-articulo.ejs';
    outputFilename = `${config.app.uploadFilesPath}/totalesporarticulo.pdf`;

    getCSSFiles(){
        return this.isPrintable? ["css/reset.scss", "css/reports.scss", "css/print.scss"] : ["css/reports.scss"];
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
                'situacionLaboral.cargo.puesto._id': 'documentoId',
                'situacionLaboral.cargo.subpuesto._id': 'documentoId',
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
        let filterArticulos: any = { $ne: null };
        if (articulosIds) {
            articulosIds = articulosIds.$in ? articulosIds.$in : [articulosIds];
            filterArticulos = { $in: articulosIds }
        }
        else {
            articulosIds = [];
        }    

        // Preparamos las opciones de filtrado sobre el agente. Removemos filtros no requeridos
        let filterCondition = utils.cleanFilters(query.filter);
        
        // Aggregation Framework Pipeline
        let pipeline:any = [
            { $match: filterCondition || {}},
            { $sort: query.sort || { apellido: 1 } },
            { $lookup: {
                    from: "ausenciasperiodo",
                    let: { agente_id: "$_id" },
                    pipeline:
                        [{
                            $match: {
                                "$expr": { $eq: ["$agente._id", "$$agente_id"] }, // 'Join' con agentes
                                "fechaHasta": { $gte: fechaDesde },
                                "fechaDesde": { $lte: fechaHasta },
                                "articulo._id": filterArticulos
                            }
                        },
                        { $unwind: "$ausencias" },
                        {
                            $match: {
                                "ausencias.fecha": {
                                    $gte: fechaDesde,
                                    $lte: fechaHasta
                                }
                            }
                        },
                        {
                        $group: {
                            "_id": { "articulo": "$articulo._id"},
                            ausenciasPorArticulo: { $sum: 1 }
                        }
                        },
                        { $group: {
                            "_id": null,
                            "ausenciasTotales": { $sum: "$ausenciasPorArticulo" },
                            "articulos": { $push: "$$ROOT" } } },
                        
                        ],
                    as: "ausentismo"
                }
            },
            { $group: groupCondition},
            { $sort: { _id:1 }}
        ]


        let gruposAgentes = await Agente.aggregate(pipeline);

        let articulos = await Articulo.find((articulosIds.length)?{"_id": { $in: articulosIds }}:{}).sort({ codigo: 1});
    
        //Nuevo filtro para enviar solo los artículos con ausencias > 0
        let articulos2 =[];
        for (const grupo of gruposAgentes){
                for (const articulo of articulos) {
                    for (const agente of grupo.agentes) {              
                        if (agente.ausentismo.length) {                            
                            let articuloMap = mapTotalArticulo(articulo, grupo.agentes);
                            for (const articulo of articuloMap) {                                
                                if( articulo!==undefined && articulo.ausencias >0){
                                    articulos2.push(articulo);                                  
                                }                               
                            }
                                  
                        }                    
                    }
                }                     
        }

        //Guarda la suma total por artículo y por agente    
        function mapTotalArticulo(articulo, agentesGrupo){
            let agentes = agentesGrupo.map(ag => {   
                if (ag.ausentismo[0]){ 
                    const idx = ag.ausentismo[0].articulos.findIndex(existArticulo, articulo);
                    ag = { 
                        _idAg: ag._id,
                        _id:articulo._id,
                        ausencias: ( idx>=0)? ag.ausentismo[0].articulos[idx].ausenciasPorArticulo : 0                                              
                    }
                    return ag;                               
                }
            })
            return agentes;
        }

        function existArticulo(element){
            return element._id.articulo.toString() == this._id.toString() ;
        }
        
        let articulosIds2=[];
        for(const art of articulos2){
            articulosIds2.push(art._id); 
        }
        
        //Reemplaza y envía solo los artículos con ausencias > 0
        articulos = await Articulo.find({"_id": { $in: articulosIds2 }}).sort({ codigo: 1});

        return { 
            gruposAgente: gruposAgentes,
            articulos: articulos,
            srcImgLogo: this.headerLogo
        }

   }
}
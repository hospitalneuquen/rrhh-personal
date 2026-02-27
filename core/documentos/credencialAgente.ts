import { Types } from 'mongoose';
import * as aqp from 'api-query-params';

import { DocumentoPDF } from './documentos';
import { Agente } from '../../modules/agentes/schemas/agente';
import { makeFs } from '../../core/tm/schemas/imagenes';

import config from '../../confg';


export class DocumentoCredencialAgente extends DocumentoPDF {
    templateName = 'credencial/agente-credencial.ejs';
    outputFilename = `${config.app.uploadFilesPath}/credencialAgente.pdf`;

    getCSSFiles(){
        return this.isPrintable? ["css/reset.scss", "css/style.scss"] : ["css/style.scss"];
    }

    async getContextData(){
        console.log("entrar en getCOntextData credencialAgente");
        const token = this.request.token;
        // Recuperamos los parametros de busqueda aplicados
        let params = aqp(this.request.query, {
            casters: {
                documentoId: val => Types.ObjectId(val),
              },
              castParams: {
                '_id': 'documentoId'
              }
        });
        // Validamos los parametros de busqueda ingresados y recuperamos los agentes de interes
        let cleanIds:any;
        const ids = params.filter['_ids'];
        if (!ids) return {};
        if (!ids.$in){
            cleanIds = (Types.ObjectId.isValid(ids))? [ids] : null;
        } 
        else{
            cleanIds = ids.$in.filter(id=> Types.ObjectId.isValid(id)); 
        }
        if (!cleanIds || !cleanIds.length) return {};
        const agentes:any = await Agente.find( { _id: { $in: cleanIds }}).lean();
        if(!agentes || !agentes.length) return {};

        // Por cada agente vamos a recuperar info extra necesaria para las crendenciales
        let srcImgCredenciales = [];
        let servicios = [];
        let funciones = [];
        const agenteFotoModel = makeFs();
        for (const agente of agentes) {
            console.log("entrar en for agente");
            //calculo para margen-top dinamico de nombre
           const nombreCompleto = `${agente.nombre || ''} ${agente.apellido || ''}`;

            const lineasNombre = this.estimarLineas(nombreCompleto);
            const funcion = `${agente.agente.situacionLaboral.cargosubpuesto.nombre || ''}`;
            const lineasFuncion = this.estimarLineas(funcion);
            let marginTop = 0;

            switch (lineasFuncion) {
                case 1:
                    switch (lineasNombre) {
                        case 1: marginTop = 35.25; break;
                        case 2: marginTop = 28; break;
                        case 3: marginTop = 16.35; break;
                        case 4: marginTop = 8.55; break;
                        default: marginTop =8.55;
                    }
                    break;
                case 2:  
                    switch (lineasNombre) {
                        case 1: marginTop = 32.3; break;
                        case 2: marginTop = 22.5; break;
                        case 3: marginTop = 13.4; break;
                        case 4: marginTop = 3.6;  break;
                        default: marginTop =3.6;
                    }
                    break;
                case 3:
                    switch (lineasNombre) {
                        case 1: marginTop = 29.5; break;
                        case 2: marginTop = 20.25; break;
                        case 3: marginTop = 11.6; break;
                        case 4: marginTop = 1.8; break;
                        default: marginTop =1.8;                        
                    }
                    break;
            }


            agente.marginTopNombre = marginTop;

            // Recuperamos la foto de cada agente
            const files = await agenteFotoModel.find({ 'metadata.agenteID': new Types.ObjectId(agente._id) });
            let file:any;
            if (files && files.length){
                for (const f of files){ // Si hay mas de un archivo procesamos el ultimos¿?
                    if (f.contentType =='image/jpg'){
                        file = f;
                    } 
                }
            }
            if (file){
                srcImgCredenciales.push(`${config.app.url}:${config.app.port}/api/modules/agentes/agentes/${agente._id}/fotos?attachment=true&token=${token}`);
            }
            else{
                srcImgCredenciales.push(`${config.app.url}:${config.app.port}/static/images/user.jpg`);
            }
            // Identificamos funcion y servicio de cada agente
            const cargo = agente.situacionLaboral? agente.situacionLaboral.cargo : null;
            funciones.push(cargo? cargo.subpuesto.nombre : '');
            servicios.push(cargo? cargo.servicio.nombre: '')
            
        }
        
        return {
            agentes: agentes,
            funciones: funciones,
            servicios: servicios,
            srcImgCredenciales: srcImgCredenciales,
            srcImgLogoHospital: `${config.app.url}:${config.app.port}/static/images/logoSolo.svg`,
        }
        
    }


    todayFormatted():String{
        let date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    private estimarLineas(texto: string): number {
        console.log("estimar lineas");
        if (!texto) return 1;

        const caracteresPorLinea = 18; 
        return Math.ceil(texto.length / caracteresPorLinea);
    }

}
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
        let margenesServicio = [];
        let margenesNombre = [];


        const agenteFotoModel = makeFs();
        for (const agente of agentes) {
            console.log("entrar en for agente");
            //calculo para margen-top dinamico de nombre
            const servicio = `${agente.situacionLaboral.cargo.servicio.nombre || ''}`;
            const lineasServicio = this.estimarLineas(servicio,34);
            console.log(servicio);
            console.log("servicio", lineasServicio);
            
            const nombreCompleto = `${agente.nombre || ''} ${agente.apellido || ''}`;
            console.log(nombreCompleto);
            const lineasNombre = this.estimarLineas(nombreCompleto,17);//11
            console.log("nombre",lineasNombre);
            
            const funcion = `${agente.situacionLaboral.cargo.subpuesto.nombre || ''}`;
            const lineasFuncion = this.estimarLineas(funcion, 22);//20
            console.log(funcion);
            console.log("funcion", lineasFuncion);
            
            let marginTopNombre = 0;
            let marginTopServicio = 0;

            switch (lineasServicio) {
                case 1: marginTopServicio = 8; break;
                case 2: marginTopServicio = 6; break;
                case 3: marginTopServicio = 0; break;
                default: marginTopServicio = 0; 
            }
            margenesServicio.push(marginTopServicio);

            switch (lineasFuncion) {
                case 1:
                    switch (lineasNombre) {
                        case 1: marginTopNombre = 35.25; break;
                        case 2: marginTopNombre = 28; break;
                        case 3: marginTopNombre = 16.35; break;
                        case 4: marginTopNombre = 8.55; break;
                        default: marginTopNombre =8.55;
                    }
                    break;
                case 2:  
                    switch (lineasNombre) {
                        case 1: marginTopNombre = 32.3; break;
                        case 2: marginTopNombre = 22.5; break;
                        case 3: marginTopNombre = 13.4; break;
                        case 4: marginTopNombre = 3.6;  break;
                        default: marginTopNombre =3.6;
                    }
                    break;
                case 3:
                    switch (lineasNombre) {
                        case 1: marginTopNombre = 29.5; break;
                        case 2: marginTopNombre = 20.25; break;
                        case 3: marginTopNombre = 11.6; break;
                        case 4: marginTopNombre = 1.8; break;
                        default: marginTopNombre =1.8;                        
                    }
                    break;
            }
           
           margenesNombre.push(marginTopNombre);
        
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
            servicios.push(cargo? cargo.servicio.nombre: '');
            funciones.push(cargo? cargo.subpuesto.nombre : '');
            
        }
        console.log("margen servicio", margenesServicio);
        console.log("margen nombre", margenesNombre);
        return {
            agentes: agentes,
            funciones: funciones,
            servicios: servicios,
            margenesServicio : margenesServicio,
            margenesNombre : margenesNombre,
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

    private estimarLineas(texto: string, caracteresPorLinea:number): number {
  
        if (!texto) return 1;
        //const caracteresPorLinea = 18; 
        console.log("long", texto.length);
        return Math.ceil(texto.length / caracteresPorLinea);
    }

}
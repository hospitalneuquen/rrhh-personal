
import { Schema, Types, model } from 'mongoose';
import { GuardiaPeriodoSchema } from './guardiaperiodo';
import { GuardiaItemPlanillaSchema } from './guardiaitemplanilla';
import { GuardiaLoteSchema } from './guardialote';


export const GuardiaSchema = new Schema({
    
    periodo: GuardiaPeriodoSchema,
    lote: GuardiaLoteSchema,
    planilla: [GuardiaItemPlanillaSchema],
    estado: String,
    fechaHoraEntrega: Date,
    responsableEntrega: {
        _id: {
            type: Types.ObjectId
        },
        nombre: String,
        apellido: String
    },
    responsableProcesamiento: { // Agente de Gestion de Personal
        _id: {
            type: Types.ObjectId
        },
        nombre: String,
        apellido: String
    },
    fechaHoraProcesamiento: Date
});

// GuardiaSchema.index({
//     periodo: 1,
//     servicio: 1,
//     categoria: 1,
//     tipoGuardia: 1
//   }, {
//     unique: true,
//   });

export const Guardia = model('Guardia', GuardiaSchema, 'guardias');
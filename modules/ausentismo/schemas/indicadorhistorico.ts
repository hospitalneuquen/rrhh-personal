import { Schema, model, Types } from 'mongoose';

export const IndicadorAusentismoHistoricoSchema = new Schema({
    timestamp: Number,
    ausentismo: {
        _id: {
            type: Types.ObjectId,
            required: true
        }
    },
    indicador: {
        _id: {
            type: Types.ObjectId,
            required: true
        }
    },
    vigencia: Number,
    intervalos: [
        {
            desde: Date,
            hasta: Date,
            totales: Number,
            ejecutadas: Number,
            asignadas: Number, 
        }
    ]
})

export const IndicadorAusentismoHistorico = model('IndicadorAusentismoHistorico', IndicadorAusentismoHistoricoSchema, 'indicadoresAusentismoHistorico');
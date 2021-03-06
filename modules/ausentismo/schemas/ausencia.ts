import { Schema, model, Types } from 'mongoose';

export const AusenciaSchema = new Schema({
    agente: {
        _id: {
            type: Types.ObjectId,
            required: true
        }
    }, 
    fecha:  {
        type: Date,
        index: true
    },
    articulo: {
        _id: {
            type: Types.ObjectId,
            required: true
        },
        codigo: {
            type: String,
            required: true
        }
    },
    // observacion: String,
    // adicional: String,
    // extra: String
})

export const Ausencia = model('Ausencia', AusenciaSchema, 'ausencias');
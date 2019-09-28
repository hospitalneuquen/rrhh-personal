import { Schema, model } from 'mongoose';

export const FeriadoSchema = new Schema({
    fecha:{
        type: Date,
        required: true,
        unique: true
    },
    descripcion:String
})

export const Feriado = model('Feriado', FeriadoSchema, 'feriados');
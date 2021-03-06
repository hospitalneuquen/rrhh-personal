import { Schema, model } from 'mongoose';
import { ProvinciaSchema } from './provincia';

export const LocalidadSchema = new Schema({
    nombre: {
        type: String,
        index: true,
        required: true,
    },
    provincia: { type: ProvinciaSchema },
    codigo: String // Se mantiene solo por compatibilidad con el sistema anterior
});

LocalidadSchema.methods._str_ = function(cb) {
    return `${this.nombre}`
  };

export const Localidad = model('Localidad', LocalidadSchema, 'localidades');

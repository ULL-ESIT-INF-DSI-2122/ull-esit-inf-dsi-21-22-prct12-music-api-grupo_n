import { SongInterface } from "../Interfaces/song_interface";
import { Schema } from "mongoose";

/**
 * Esquema que define los aributos de los objetos song y sus validaciones
 */
export const SongSchema = new Schema<SongInterface>({
  song_name: {
    type: String,
    unique: true,
    trim: true,
    require: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Song must start with capital letter');
      }
    },
  },
  author: {
    type: String,
    unique: true,
    trim: true,
    require: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Author`s song must start with capital letter');
      }
    },
  },
  duration: {
    type: Number, 
    require: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('Song`s duration must be greater than zero');
      }
    },
  },
  gender: {
    type: [String],
    require: true,
    enum: ['Rap', 'Bachata', 'Rock', 'Heavy Metal', 'K-Pop', 'House', 'Samba', 
           'Clasica', 'Blues', 'R&B', 'ElectroSwing', 'Reage', 'Reggeaton', 
           'Salsa', 'Pop', 'Banda sonora', 'Jazz', 'Trap', 'Country', 'Soul'],
  },
  single: {
    type: Boolean,
    require: true,
    default: false,
  },
  plays: {
    type: Number,
    require: true,
    validate: (value: number) => {
      if(value < 0) {
        throw new Error('A song cannot has reproduction with a negative value');
      }
    },
  },
});


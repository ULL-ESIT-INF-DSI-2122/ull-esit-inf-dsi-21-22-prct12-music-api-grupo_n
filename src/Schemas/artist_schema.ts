import { ArtistInterface } from "../Interfaces/artist_interface";
import { SongSchema } from "./song_schema";
import { Schema } from "mongoose";

/**
 * Esquema que define los aributos de los objetos artista y sus validaciones
 */
export const ArtistSchema = new Schema<ArtistInterface>({
  artist_name: {
    type: String,
    unique: true,
    trim: true,
    require: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Artist must start with capital letter');
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
  songs: {
    type: [SongSchema],
    require: true,
  },
  listeners: {
    type: String,
    trim: true,
    require: true,
    validate: (value: number) => {
      if(value < 0) {
        throw new Error('An artist cannot has listeners with a negative value');
      }
    },
  },
});
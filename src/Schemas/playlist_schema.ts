import { PlaylistInterface } from "../Interfaces/playlist_interface";
import { SongSchema } from "./song_schema";
import { Schema } from "mongoose";

/**
 * Esquema que define los aributos de los objetos playlist y sus validaciones
 */
export const PlaylistSchema = new Schema<PlaylistInterface>({
  playlist_name: {
    type: String,
    unique: true,
    trim: true,
    require: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Playlist must start with capital letter');
      }
    },
  },
  songs: {
    type: [SongSchema],
    require: true,
  },
  duration: {
    type: Number,
    require: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Playlist duration must be greater than zero');
      }
    },
  },
  genders: {
    type: [String],
    require: true,
    enum: ['Rap', 'Bachata', 'Rock', 'Heavy Metal', 'K-Pop', 'House', 'Samba', 
           'Clasica', 'Blues', 'R&B', 'ElectroSwing', 'Reage', 'Reggeaton', 
           'Salsa', 'Pop', 'Banda sonora', 'Jazz', 'Trap', 'Country', 'Soul'],
  },
});
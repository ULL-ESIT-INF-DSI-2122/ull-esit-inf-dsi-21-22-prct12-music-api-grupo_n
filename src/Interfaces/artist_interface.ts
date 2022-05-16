import { Document } from "mongoose";
import { SongInterface } from "./song_interface";

/**
 * Interfaz que representa el esqueleto de los objetos artista
 */
export interface ArtistInterface extends Document {
  artist_name: string,
  gender: string[],
  songs: SongInterface[],
  listeners: number,
}

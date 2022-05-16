import { Document } from "mongoose";

/**
 * Interfaz que representa el equeleto de los objetos Song
 */
export interface SongInterface extends Document {
  song_name: string,
  author: string,
  duration: number,
  gender: string[],
  single: boolean,
  plays: number,
}

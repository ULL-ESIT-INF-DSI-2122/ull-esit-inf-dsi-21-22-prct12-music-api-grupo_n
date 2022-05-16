import { Document } from "mongoose";
import { SongInterface } from "./song_interface";

/**
 * Interfaz que representa el esqueleto de los objetos playlist
 */
export interface PlaylistInterface extends Document {
  playlist_name: string,
  songs: SongInterface[],
  duration: string,
  genders: string[],
}
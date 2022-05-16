import { Document } from "mongoose";
import { SongInterface } from "./song_interface";

export interface PlaylistInterface extends Document {
  playlist_name: string,
  songs: SongInterface[],
  duration: string,
  genders: string[],
}
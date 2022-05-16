import { Document } from "mongoose";
import { SongInterface } from "./song_interface";

export interface ArtistInterface extends Document {
  artist_name: string,
  gender: string[],
  songs: SongInterface[],
  listeners: number,
}

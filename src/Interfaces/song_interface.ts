import { Document } from "mongoose";

export interface SongInterface extends Document {
  song_name: string,
  author: string,
  duration: number,
  gender: string[],
  single: boolean,
  plays: number,
}

import { Document } from "mongoose";

export interface SongInterface extends Document {
  song_name: string,
  author: string,
  duration: string,
  gender: string[],
  single: boolean,
  plays: number,
}

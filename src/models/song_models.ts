import { SongInterface } from "../Interfaces/song_interface";
import { SongSchema } from "../Schemas/song_schema";
import { model } from "mongoose";

/**
 * Modelo de una Song
 */
export const song = model<SongInterface>('Song', SongSchema);
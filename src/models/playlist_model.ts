import { PlaylistInterface } from "../Interfaces/playlist_interface";
import { PlaylistSchema } from "../Schemas/playlist_schema";
import { model } from "mongoose";

/**
 * Modelo de una playlist
 */
export const playlist = model<PlaylistInterface>('Playlist', PlaylistSchema);
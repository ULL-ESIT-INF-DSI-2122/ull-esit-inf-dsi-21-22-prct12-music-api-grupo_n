import { ArtistInterface } from "../Interfaces/artist_interface";
import { ArtistSchema } from "../Schemas/artist_schema";
import { model } from "mongoose";

/**
 * Modelos de una artista
 */
export const artist = model<ArtistInterface>('Artist', ArtistSchema);
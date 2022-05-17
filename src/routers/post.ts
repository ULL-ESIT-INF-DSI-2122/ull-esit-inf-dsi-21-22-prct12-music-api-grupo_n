import * as express from 'express';
import { song } from '../models/song_models';
import { artist } from '../models/artist_model';
import { playlist } from '../models/playlist_model';

//añadir objetos (revisar)

export const postRouter = express.Router();

postRouter.post('/songs', (req, res) => {
  const new_song = new song(req.body);
  
  new_song.save().then((song) => {
    res.status(201).send(song);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

postRouter.post('/artists', (req, res) => {
  const new_artist = new artist(req.body);
  
  new_artist.save().then((artist) => {
    res.status(201).send(artist);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

postRouter.post('/playlists', (req, res) => {
  const new_playlist = new playlist(req.body);
  
  new_playlist.save().then((playlist) => {
    res.status(201).send(playlist);
  }).catch((error) => {
    res.status(400).send(error);
  });
});
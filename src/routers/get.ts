import * as express from 'express';
import { song } from '../models/song_models';
import { artist } from '../models/artist_model';
import { playlist } from '../models/playlist_model';

//leer

export const getRouter = express.Router();

getRouter.get('/songs', (req, res) => {
  const filter = req.query.song_name?{song_name: req.query.song_name.toString()}:{};

  song.find(filter).then((songs) => {
    if (songs.length !== 0) res.send(songs);
    else res.status(404).send('Song Not Found');
  }).catch((error) => {
    res.status(500).send(error);
  });
});

getRouter.get('/songs/:id', (req, res) => {

  song.findById(req.params.id).then((song) => {
    if (!song){
      res.status(404).send('Song not found');
    } else {
      res.send(song);
    }
  }).catch((error) => {
    res.status(501).send();
  });
});

getRouter.get('/artists', (req, res) => {
  const filter = req.query.artist_name?{artist_name: req.query.artist_name.toString()}:{};

  artist.find(filter).then((artists) => {
    if (artists.length !== 0) res.send(artists);
    else res.status(404).send('Artist Not Found')
  }).catch((error) => {
    res.status(500).send(error);
  });
});

getRouter.get('/artists/:id', (req, res) => {
  artist.findById(req.params.id).then((artist) => {
    if (!artist){
      res.status(404).send('Artist not found');
    } else {
      res.send(artist);
    }
  }).catch((error) => {
    res.status(501).send(error);
  });
});

getRouter.get('/playlists', (req, res) => {
  const filter = req.query.playlist_name?{playlist_name: req.query.playlist_name.toString()}:{};

 playlist.find(filter).then((playlist) => {
    if (playlist.length !== 0) res.send(playlist);
    else res.status(404).send('Playlist Not Found')
  }).catch((error) => {
    res.status(500).send(error);
  });
});

getRouter.get('/playlists/:id', (req, res) => {
  playlist.findById(req.params.id).then((playlist) => {
    if (!playlist) {
      res.status(404).send();
    } else {
      res.send(playlist);
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});

import * as express from 'express';
import { song } from '../models/song_models';
import { artist } from '../models/artist_model';
import { playlist } from '../models/playlist_model';

export const deleteRouter = express.Router();

deleteRouter.delete('/songs', (req, res) => {
  if (!req.query.song_name) {
    res.status(400).send({
      error: 'A Song must be provided',
    });
  } else {
    song.findOneAndDelete({title: req.query.song_name.toString()}).then((song) => {
      if (!song) {
        res.status(404).send({
          error: 'Song not found',
        });
      } else {
        res.send(song);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});

deleteRouter.delete('/songs/:id', (req, res) => {
  song.findByIdAndDelete(req.params.id).then((song) => {
    if (!song) {
      res.status(404).send({
        error: 'Song not found',
      });
    } else {
      res.send(song);
    }
  }).catch((error) => {
    res.status(400).send(error);
  });
});

deleteRouter.delete('/artists', (req, res) => {
  if (!req.query.artist_name) {
    res.status(400).send({
      error: 'Artist must be provided',
    });
  } else {
    artist.findOneAndDelete({artist_name: req.query.artist_name.toString()}).then((artist) => {
      if (!artist) {
        res.status(404).send({
          error: 'Song not found',
        });
      } else {
        res.send(artist);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});

deleteRouter.delete('/artists/:id', (req, res) => {
  artist.findByIdAndDelete(req.params.id).then((artist) => {
    if (!artist) {
      res.status(404).send({
        error: 'Song not found',
      });
    } else {
      res.send(artist);
    }
  }).catch((error) => {
    res.status(400).send(error);
  });
});

deleteRouter.delete('/playlist', (req, res) => {
  if (!req.query.playlist_name) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    playlist.findOneAndDelete({playlist_name: req.query.playlist_name.toString()}).then((playlist) => {
      if (!playlist) {
        res.status(404).send({
          error:'Playlist not found'
        });
      } else {
        res.send(playlist);
      }
    }).catch((error) => {
      res.status(400).send();
    });
  }
});

deleteRouter.delete('/playlist/:id', (req, res) => {
  playlist.findByIdAndDelete(req.params.id).then((playlist) => {
    if (!playlist) {
      res.status(404).send();
    } else {
      res.send(playlist);
    }
  }).catch((error) => {
    res.status(400).send(error);
  });
});



import * as express from 'express';
import { song } from '../models/song_models';
import { artist } from '../models/artist_model';
import { playlist } from '../models/playlist_model';

//modificar (funciona para cada tipo, nombre e id)

export const patchRouter = express.Router();

patchRouter.patch('/songs', (req, res) => {
  if (!req.query.song_name) {
    res.status(400).send({
      error: 'A Song name must be provided',
    });
  } else {
    const allowedUpdates = ['song_name', 'author', 'duration', 'gender', 'single', 'plays'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      song.findOneAndUpdate({song_name: req.query.song_name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((song) => {
        if (!song) {
          res.status(404).send({
            error: 'Song not found and cant be update',
         });
        } else {
          res.send(song);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    };
  };
});

patchRouter.patch('/songs/:id', (req, res) => {
  const allowedUpdates = ['song_name', 'author', 'duration', 'gender', 'single', 'plays'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'Update is not permitted',
    });
  } else {
    song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).then((song) => {
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
  };
});

patchRouter.patch('/artists', (req, res) => {
  if (!req.query.artist_name) {
    res.status(400).send({
      error: 'An Artist must be provided',
    });
  } else {
    const allowedUpdates = ['artist_name', 'gender', 'songs', 'listeners'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      artist.findOneAndUpdate({artist_name: req.query.artist_name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((artist) => {
        if (!artist) {
          res.status(404).send({
            error: 'Artist not Found',
          });
        } else {
          res.send(artist);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

patchRouter.patch('/artists/:id', (req, res) => {
  const allowedUpdates = ['artist_name', 'gender', 'songs', 'listeners'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'Update is not permitted',
    });
  } else {
    artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).then((artist) => {
      if (!artist) {
        res.status(404).send({
          error: 'Artist not Found',
        });
      } else {
        res.send(artist);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});

patchRouter.patch('/playlists', (req, res) => {
  if (!req.query.playlist_name) {
    res.status(400).send({
      error: 'The playlist name must be provided',
    });
  } else {
    const allowedUpdates = ['playlist_name', 'songs', 'duration', 'genders'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      playlist.findOneAndUpdate({playlist_name: req.query.playlist_name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((playlist) => {
        if (!playlist) {
          res.status(404).send({
            error: 'Playlist not found'
          });
        } else {
          res.send(playlist);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

patchRouter.patch('/playlists/:id', (req, res) => {
  const allowedUpdates = ['playlist_name', 'songs', 'duration', 'genders'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'Update is not permitted',
    });
  } else {
    playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).then((playlist) => {
      if (!playlist) {
        res.status(404).send({
          error: 'Playlist not found'
        });
      } else {
        res.send(playlist);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});


# Práctica 12 - API Node/Express de gestión de información musical

## Introducción

En esta práctica grupal implementaremos una API/REST haciendo uso de Node/Express que lleve a cabo operaciones de creación (`post - create`), lectura (`get - read`), modificación (`patch - update`) y borrado (`delete`) de nuestra biblioteca musical que contendrá canciones, artistas y playlist.

## Desarrollo

### Moongose

Para realizar la conexión al servidor de MongoDB haremos uso del método `connect` de Mongoose, como primer argumento recibirá la URL de conexión del servidor y como segundo argumento nos encontramos con un objeto con las correspondientes opciones de conexión. El método connect devolverá una promesa que podremos tratar para filtrar la información del estado de la conexión.

```typescript
const mongoose_url = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/music-library';

connect(mongoose_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unnable to connect to MongoDB server');
});
```

La URL de conexión a la base de datos estará almacenada en una variable de entorno llamada `MONGODB_URL`, si no estuviera especificada esta dirección pasaría a ejecutar la URL para la conexión local.


### Interfaces

#### Song

En esta interfaz se definirá como seran los objetos Song que se crearán y entrarán en la base de datos, esta interfaz se verá de la siguiente manera:

```typescript
export interface SongInterface extends Document {
  song_name: string,
  author: string,
  duration: number,
  gender: string[],
  single: boolean,
  plays: number,
}
```

Aquí nos encontraremos con diferentes campos que formarán la canción como son el nombre de la canción, el autor de la canción, la duración de la canción, el género o géneros a los que pertenece la canción, si esta canción es un single o no y el número de reproducciones que tiene la canción.

#### Artist

En esta interfaz se definirán la forma de los objetos Artist que se crearán para ser insertados en la base de datos, esta interfaz se verá de la siguiente manera:

```typescript
export interface ArtistInterface extends Document {
  artist_name: string,
  gender: string[],
  songs: SongInterface[],
  listeners_mth: number,
}
```

Aquí nos encontramos distintos campos como son el nombre del artista, el género o géneros a los cuales pertenezca el artista, las canciones que las cuales es el autor y se encuentran dentro de la base de datos y el número de oyentes mensuales del artista.

#### Playlist

En esta interfaz se denfinirá la forma que tendran los objetos Playlist que se crearán y sera introducidos en la base de datos, esta interfaz se verá de la siguiente manera:

```typescript
export interface PlaylistInterface extends Document {
  playlist_name: string,
  songs: SongInterface[],
  duration: string,
  genders: string[],
}
```

Aquí nos encontramos con distintos campos como son el nombre de la playlists, las canciones que forman esa playlists de las canciones que ya existen dentro de la base de datos, la duración de la playlist y los géneros que nos encontramos dentro de la playlist.


### Schemas

Un **esquema** es el método que tendremos para modelar objetos en **Mongoose**, esta estructura permite definir los tipos de cada una de las propiedades del objeto, añadiendo características de cada una de estas propiedades e incluso validadores para analizar los valores antes de ser almacenados en la base de datos. 

#### Song

Para analizar los esquemas de cada uno de los elementos requeridos (`song`, `artist`, `playlist`) hablaremos de sus propiedades por separado, aquí podemos ver el esquema completo:

```typescript
export const SongSchema = new Schema<SongInterface>({
  song_name: {
    type: String,
    unique: true,
    trim: true,
    require: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Song must start with capital letter');
      }
    },
  },
  author: {
    type: String,
    trim: true,
    require: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Author`s song must start with capital letter');
      }
    },
  },
  duration: {
    type: Number, 
    require: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('Song`s duration must be greater than zero');
      }
    },
  },
  gender: {
    type: [String],
    require: true,
    enum: ['Rap', 'Bachata', 'Rock', 'Heavy Metal', 'K-Pop', 'House', 'Samba', 
           'Clasica', 'Blues', 'R&B', 'ElectroSwing', 'Reage', 'Reggeaton', 
           'Salsa', 'Pop', 'Banda sonora', 'Jazz', 'Trap', 'Country', 'Soul'],
  },
  single: {
    type: Boolean,
    require: true,
    default: false,
  },
  plays: {
    type: Number,
    require: true,
    validate: (value: number) => {
      if(value < 0) {
        throw new Error('A song cannot has reproduction with a negative value');
      }
    },
  },
});
```

- **song_name** (`String`): corresponde al nombre de una canción, este parámetro es único y debe empezar por una letra mayúscula.
- **author** (`String`): corresponde al autor de una canción, este parámetro es único y debe empezar por una letra mayúscula.
- **duration** (`Number`): corresponde a la duración de la cancion, debe ser mayor que cero.
- **gender** (`[String]`): corresponde a el género o los géneros que tiene una cancion, esta opción está limitada a una serie de géneros previamente indicados con un `enum`.
- **single** (`Boolean`): indicador si la canción es un single (`true`) o pertenece a un album (`false`), por defecto su valor es `false`.
- **plays**: corresponde al número de reproducciones que tiene una canción, estas reproducciones pueden ser cero pero no pueden ser valores negativos.


#### Artist

Ahora procedemos a analizar el esquema de `artist`:

```typescript
export const ArtistSchema = new Schema<ArtistInterface>({
  artist_name: {
    type: String,
    unique: true,
    trim: true,
    require: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Artist must start with capital letter');
      }
    },
  },
  gender: {
    type: [String],
    require: true,
    enum: ['Rap', 'Bachata', 'Rock', 'Heavy Metal', 'K-Pop', 'House', 'Samba', 
           'Clasica', 'Blues', 'R&B', 'ElectroSwing', 'Reage', 'Reggeaton', 
           'Salsa', 'Pop', 'Banda sonora', 'Jazz', 'Trap', 'Country', 'Soul'],
  },
  songs: {
    type: [SongSchema],
    require: true,
  },
  listeners_mth: {
    type: String,
    trim: true,
    require: true,
    validate: (value: number) => {
      if(value < 0) {
        throw new Error('An artist cannot has listeners with a negative value');
      }
    },
  },
});
```

- **artist_name** (`String`): corresponde al nombre del artista, este nombre es único y debe empezar por una letra mayúscula.
- **gender** (`[String]`): corresponde a el género o los géneros que tiene una cancion, esta opción está limitada a una serie de géneros previamente indicados con un `enum`.
- **songs** (`[SongSchema]`): corresponde al conjunto de canciones que posee el artista.
- **listeners_mth** (`String`): corresponde al número de oyentes mensuales, estas reproducciones pueden ser cero pero no pueden ser valores negativos.

#### Playlist

Y para finalizar los esquemas analizaremos el de `playlist`:

```typescript
export const PlaylistSchema = new Schema<PlaylistInterface>({
  playlist_name: {
    type: String,
    unique: true,
    trim: true,
    require: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Playlist must start with capital letter');
      }
    },
  },
  songs: {
    type: [SongSchema],
    require: true,
  },
  duration: {
    type: Number,
    require: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('Playlist duration must be greater than zero');
      }
    },
  },
  genders: {
    type: [String],
    require: true,
    enum: ['Rap', 'Bachata', 'Rock', 'Heavy Metal', 'K-Pop', 'House', 'Samba', 
           'Clasica', 'Blues', 'R&B', 'ElectroSwing', 'Reage', 'Reggeaton', 
           'Salsa', 'Pop', 'Banda sonora', 'Jazz', 'Trap', 'Country', 'Soul'],
  },
}); 
```

- **playlist_name** (`String`): corresponde al nombre de una playlist, este parámetro es único y debe empezar por una letra mayúscula.
- **songs** (`[SongSchema]`): corresponde al conjunto de canciones que posee el artista.
- **duration** (`Number`): corresponde a la duración de la playlist, debe ser mayor que cero.
- **genders** (`[String]`): corresponde a el género o los géneros que tiene una playlist, esta opción está limitada a una serie de géneros previamente indicados con un `enum`.


### Modelos 

Un **modelo** es el método por el cual instanciaremos y almacenaremos documentos en la base de datos, estas se ajustarán a los anteriores mencionados **esquemas**.

#### Song

En este apartado definimos el modelo para canciones lo que nos permitirá instanciar y almacenar en nuestra base de datos objetos song que sigan el schema dado con anterioridad, este modelo se ve de la siguiente manera:

```typescript
export const song = model<SongInterface>('Song', SongSchema);
```

#### Artist

En este apartado definimos el modelo para artistas lo que nos permitirá instanciar y almacenar en la base de datos objetos artist que sigan el schema especificado con anterioridad, este modelo se ve de la siguiente manera:

```typescript
export const artist = model<ArtistInterface>('Artist', ArtistSchema);
```
#### Playlist

En este apartado denifnimos el modelo para las Playlists lo que nos permitira instanciar y almacenar en la base de datos objetos playlists que sigan el schema especificado, este modelo se ve de la siguiente manera:

```typescript
export const playlist = model<PlaylistInterface>('Playlist', PlaylistSchema);
```

### Routers 

#### Default
  
Para cualquier ruta que no esté implementada o definida, hemos realizado el siguiente código, para que sea interceptado y saque  un mensaje de que no está implemantada y el status sea 501.

```typescript
import * as express from 'express';

export const defaultRouter = express.Router();

defaultRouter.all('*', (_, res) => {
  res.status(501).send('Not Implemented');
});
```

#### Post 

En este método manejaremos las solicitudes de tipo POST lo que nos permitirá añadir una canción/artista/playlist a la base de datos, esto lo hace a través de lo que se encuentre en el req.body del request que mandemos siempre y cuando cumpla con las especificaciones del schema.

Para llevar a cabo peticiones como estas la haremos mediante la siguiente url ``https://group-n-music.herokuapp.com/`` añadiendo despues de la ultima barra songs/artist/playlist dependiendo de que elemento querramos introducir en la base de datos y después introduciendo los datos desde el body de thunder client.

El método post se ve de la siguiente manera para songs/artist/playlist: 

```typescript
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
```

#### Get

Para explicar el procedimiento que seguimos para todos los tipos de elementos que tenemos haremos ejemplos con el elemento `songs`, todos los demás siguien la misma dinámica. 

En primer lugar se comprueba desde que ruta se hace la petición `HTTP GET`, si se hace desde la ruta `/songs` procederá a ejecutarse:

```typescript
getRouter.get('/songs', (req, res) => {
  const filter = req.query.song_name?{song_name: req.query.song_name.toString()}:{};

  song.find(filter).then((songs) => {
    if (songs.length !== 0) res.send(songs);
    else res.status(404).send('Song Not Found');
  }).catch((error) => {
    res.status(500).send(error);
  });
});
```

Para filtrar los resultados que queremos obtener (en este caso filtrar por el nombre de la canción) utilizaremos una `query string` haciendo referencia a la propiedad `song_name`.

Luego haremos uso del método `find` para buscar elementos que coincidan con el filtro que mencionamos. Este método podría devolver varios resultados, pero al estar utilizando la característica `song_name` que es única solo devolverá uno. En el caso de no encontrar una nota devolverá una respuesta 404 (Not Found) y mostraríamos un mensaje de error `Song Not Found`, pero en el caso de que ocurriera un error durante la búsqueda recibiríamos una respuesta 500 (Internal Server Error) y mostraríamos el error que corresponda.

También seremos capaces de filtrar por ID de la base de datos, en este caso vemos que la ruta que estamos esperando es `/songs/:id`, la propiedad `/:id` permite introducir dinamismo en la ruta, por lo tanto en la posición en la que se encuentra espera el ID de la base de datos, por ejemplo `/songs/62862e087869c40016c59ef8`:

```typescript
getRouter.get('/songs/:id', (req, res) => {

  song.findById(req.params.id).then((song) => {
    if (!song){
      res.status(404).send('Song not found');
    } else {
      res.send(song);
    }
  }).catch((error) => {
    res.status(501).send(error);
  });
});
```

Para poder obtener este parámetro utilizaremos `req.params.id` en el manejador, si encuentra el resultado (que debe ser único porque el identificador lo es) podremos filtrarlo para emitir los errores como explicamos anteriormente en la opción para filtrar por el nombre de la canción.

#### Patch

En este método manejaremos las solicitudes de tipo PATCH lo que nos permitirá modificar una canción/artista/playlist en la base de datos, para ello hemos de especificar la canción/artista/playlist que queramos encontrar en la base de datos o la id única de la canción/artista/playlist para después modificarlo, la modificación del elemento vendrá dada por la información que introducimos en el req.body, para ello hemos de volver a escribir todo el item cambiando lo que consideremos para llevar a cabo la modificación del elemento pero solo se podrán modificar los elementos permitidos que son los que se encuentran en el schema pues no podremos introducir nada que no aparezca en el schema de nuestra base de datos.

Para llevar a cabo peticiones como estas la haremos mediante la siguiente url ``https://group-n-music.herokuapp.com/`` añadiendo despues de la ultima barra songs/artist/playlist y despues añadiendo un parametro por la url que sea el nombre de la cancion/artista/playlist o el id del elemento unico (por ejemplo ``https://group-n-music.herokuapp.com/songs?song_name=Holidays``), dependiendo de qué elemento queramos introducir en la base de datos y después introduciendo los datos a modificar desde el body de thunder client.

```typescript
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
```

(Aqui unicamente se muestra una pequeña parte del codigo que pertenece a el metodo para songs, para los demas elementos como artistas y playlist tambien se encuentran en el fichero patch.ts)


#### Delete 

En este método manejaremos las solicitudes de tipo DELETE lo que nos permitirá eliminar una canción/artista/playlist en la base de datos, para ello hemos de especificar la canción/artista/playlist que queramos encontrar en la base de datos o la id única de la canción/artista/playlist para después eliminarlo.
 
Para llevar a cabo peticiones como estas la haremos mediante la siguiente url ``https://group-n-music.herokuapp.com/`` añadiendo despues de la ultima barra songs/artist/playlist y despues añadiendo un parametro por la url que sea el nombre de la cancion/artista/playlist o el id del elemento unico (por ejemplo ``https://group-n-music.herokuapp.com/songs?song_name=Holidays``), dependiendo de qué elemento queramos introducir en la base de datos y después introduciendo los datos a modificar desde el body de thunder client.

```typescript
export const deleteRouter = express.Router();

deleteRouter.delete('/songs', (req, res) => {
  if (!req.query.song_name) {
    res.status(400).send({
      error: 'A Song must be provided',
    });
  } else {
    song.findOneAndDelete({song_name: req.query.song_name.toString()}).then((song) => {
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
```

### Server

Se puede observar como, en primer lugar, importamos todos y cada uno de los routers que hemos definido y exportado en los ficheros anteriores. Además, véase también como registramos cada uno de esos routers en nuestra aplicación a partir del uso del método app.use().
  
Luego definimos `port`, para asignar un puerto, con la variable de entorno `PORT` o, por defecto, en el puerto `3000`, es por tanto que el código del server queda de la siguiente manera: 

```typescript
import * as express from 'express';
import '../db/mongoose';
import { postRouter } from '../routers/post';
import { getRouter } from '../routers/get';
import { patchRouter } from '../routers/patch';
import { deleteRouter } from '../routers/delete';
import { defaultRouter } from '../routers/default';

const app = express();
app.use(express.json());
app.use(postRouter);
app.use(getRouter);
app.use(patchRouter);
app.use(deleteRouter);
app.use(defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
```

## Despliegue de la API
  
Para la realización del despliegue, tedremos que crear, en el sitio web **MonoDB Atlas**, una organización, de nombre **DSI**, donde crearemos un proyecto. A continuación Crearemos un cluster de nombre `music-library` dados los pasos a seguir de los apuntes de la asignatura. Para poder conectarnos a esta ingrtaestructura, tendremos que realizarlo a travez de la URI `mongodb+srv://music-library:*****@cluster0.mwazf.mongodb.net/music` donde los asteriscos está reservado para la contraseña del usuario de la base de datos.  
  
Para los siguientes pasos, tendremos que instalar la herramienta `Heroku`
y realizar el `login`. Luego crearemos una app a travez de dicha herramienta, cuyto nombre será `group-n-music` y en ella deslegaremos la URL que nos había proporcionado MongoDB Atlas anteriormente, realizando los siguientes comandos:  
  
```bash
$heroku config:set MONGODB_URL= mongodb+srv:/music-library:*****@cluster0.mwazf.mongodb.net/music

$git push heroku main

```
  
Si todo se ha realizado correctamente, se nos otorgará una URL sobre la que poder realizar las operaciones de **POST**, **GET**, **PATCH** y **DELETE**. En este caso, la URL es `https://group-n-music.herokuapp.com`.  


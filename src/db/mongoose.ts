import { connect } from 'mongoose';

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
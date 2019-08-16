import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';

import authenticationController from './controllers/authentication';
import accountController from './controllers/account';
import questionController from './controllers/question';
import testController from './controllers/test';

// global config
const app = express();
const port = 3001;
const secret = 'very-secret-secret';
const conString = 'mongodb://localhost/natfis';

// Mongoose config
mongoose.connect(conString, { useNewUrlParser: true, useFindAndModify: false })
  .catch(err => console.error);

// Express config
app.use(cors());
app.use(express.json());
app.use(session({ secret }));

// Apply controllers
app.use('/api/authentication/', authenticationController);
app.use('/api/account/', accountController);
app.use('/api/question/', questionController);
app.use('/api/test/', testController);

// Start express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

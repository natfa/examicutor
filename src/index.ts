import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';

import authenticationController from './controllers/authentication';
import accountController from './controllers/account';
import questionController from './controllers/question';

// global config
const app = express();
const port = 3000;
const secret = 'very-secret-secret';
const conString = 'mongodb://localhost/natfis';

// Mongoose config
mongoose.connect(conString, { useNewUrlParser: true, useFindAndModify: false })
  .catch(err => console.error);

// Express config
app.use(express.json());
app.use(session({ secret }));

// Apply controllers
app.use('/authentication/', authenticationController);
app.use('/account/', accountController);
app.use('/question/', questionController);

// Start express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

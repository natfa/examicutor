import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';

import accountController from './controllers/account';

// global config
const app = express();
const port = 3000;
const secret = 'very-secret-secret';
const conString = 'mongodb://localhost/natfis';

// Mongoose config
mongoose.connect(conString, { useNewUrlParser: true })
  .catch(err => console.error);

// Express config
app.use(express.json());
app.use(session({ secret }));

// Apply controllers
app.use('/account/', accountController);

// Start express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
import { Application } from 'express';

import apiRoute from './api';

function init(app: Application) {
  app.use('/api', apiRoute);
}

export default {
  init,
};

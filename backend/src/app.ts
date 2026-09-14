import express, { type Express, type Request, type Response } from 'express';
import apiRoutes from './routes/index';

import dotenv from 'dotenv';
dotenv.config(); 

const app: Express = express();
const port = process.env.PORT || 3000;

// features
app.use(express.json()); 

// routes
app.use('/api/v1', apiRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
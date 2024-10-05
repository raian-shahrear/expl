import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());

// application route
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Exploring-world Server!');
});

// application middleware
// app.use(globalErrorHandler);
// app.use(notFound);

export default app;

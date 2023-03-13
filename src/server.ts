import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Loggin from './library/Loggin';
import authorRoutes from './routes/Author';
import bookRoutes from './routes/Book';
const router = express();

// Connect to Mongo
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
.then(() => {
    Loggin.info('Connected to mongoDB.');
    StartServer();    
})
.catch(error => {
    Loggin.error('Unable to connect');
    Loggin.error(error)
});

// Only start server when Mongo is Connect
const StartServer = () => {
    router.use((req, res, next) => {
      // Log the request
        Loggin.info(`Incoming -> Method: [${req.method}] - url [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            // Log the response
            Loggin.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: ${req.socket.remoteAddress}] Status: [${req.statusCode}]`);
        });
        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    //Rules of our API
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, x-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    // Routes
    router.use('/authors', authorRoutes);
    router.use('/books', bookRoutes);
    // Healthcheck
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    // Error handling
    router.use((req, res, next) => {
        const error = new Error('not Found');
        Loggin.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Loggin.info(`Server is running on port ${config.server.port}`));
};

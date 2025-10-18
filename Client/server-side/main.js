import express from 'express';
import routes from './routes.js';
import cors from 'cors';

const app = express();
const port = 3000; // Sesuai dengan konfigurasi backend Anda

const startServer = () => {
    try {
        const whitelist = [
            'http://localhost:3001', // Frontend saat dev
            'https://pt-bumi-nirwana-estate.vercel.app', // Frontend saat production
            'https://nest-deploy-lemon.vercel.app'
        ];

        const corsOptions = {
            origin: function (origin, callback) {
                if (whitelist.indexOf(origin) !== -1 || !origin) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
        };

        app.use(cors(corsOptions));
        app.use(express.json());

        app.use('/', routes);

        app.listen(port, () => {
            console.log(`Backend server is running on port: ${port}`);
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();
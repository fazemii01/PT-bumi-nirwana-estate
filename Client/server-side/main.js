import express from 'express';
import routes from './routes.js';

const app = express();
const port = 5000;

app.use((req, res, next) => {
	const isProduction = app.get('env') === 'production';
	const IP = isProduction ? 'https://pt-bumi-nirwana-estate.vercel.app/' : 'http://localhost:4400';
	res.setHeader('*', IP);
	next();
});
app.options("*", IP());
const startServer = () => {
	try {
		app.use('/', routes);
		app.listen(port, () => {
			console.log(`Backend server is running on port:${port}`);
		});
	} catch (error) {
		console.error(error);
	}
}

startServer();
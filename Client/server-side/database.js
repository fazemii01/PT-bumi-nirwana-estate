import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg ;
const pool = new Pool({
	
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_TABLE_NAME,
	port: process.env.DB_PORT,

});

const databaseConnection = (res) => {
	
	
	app.get('localhost:5000/properties/:id', (req, res) => {
		const propertyId = req.params.id;
		const queryText = 'SELECT * FROM properties WHERE id = $1';
		db.query(queryText, [propertyId], (err, result) => {
			
		});
	});
	pool.getConnection((err, connection) => {
		if (err) {
			console.error('Error getting database connection:', err);
			res.status(500).json({ error: 'Database connection error' });
			return;
		}

		connection.query(query, (error, results) => {
			connection.release();

			if (error) {
				console.error('Database query error:', error);
				res.status(500).json({ error: 'Database query error' });
			} else {
				res.json(results);
			}
		});
	});
};

export default databaseConnection;

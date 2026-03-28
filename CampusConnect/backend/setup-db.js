const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
  try {
    const sqlPath = path.join(__dirname, '..', 'database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Yash',
      multipleStatements: true
    });

    console.log('Connected to MySQL. Executing database.sql...');
    
    await connection.query(sqlContent);
    
    console.log('Database and tables have been perfectly created!');
    
    await connection.end();
  } catch (error) {
    console.error('An error occurred during DB initialization:', error.message);
    process.exit(1);
  }
}

setupDatabase();

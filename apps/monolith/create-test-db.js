const mysql = require('mysql2/promise');

async function createDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME || 'archkit_user',
    password: process.env.DB_PASSWORD || 'archkit_password',
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS archkit_monolith_test;');
  console.log('Database archkit_monolith_test created or already exists.');
  await connection.end();
}

createDb().catch(console.error);

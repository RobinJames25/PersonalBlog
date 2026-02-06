const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine if we are in production (Render) or development (Local)
// Render sets NODE_ENV to 'production' automatically.
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  // --- PRODUCTION SETTINGS (Render) ---
  // Render provides a single "External Database URL" or "Internal Database URL"
  // You must add a variable called DATABASE_URL in Render Dashboard
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        // This is crucial for Render/Heroku to prevent "Self-signed certificate" errors
        rejectUnauthorized: false 
      }
    },
    logging: false // Keep production logs clean
  });
} else {
  // --- DEVELOPMENT SETTINGS (Localhost) ---
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST || 'localhost', // Fallback to localhost if not set
      dialect: 'postgres',
      logging: console.log // Show SQL queries in dev for debugging
    }
  );
}

module.exports = sequelize;
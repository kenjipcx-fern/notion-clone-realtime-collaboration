import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection options for production-ready setup
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Configure PostgreSQL client with connection pooling
export const sql = postgres(connectionString, {
  max: 20, // Maximum number of connections in the pool
  idle_timeout: 20, // Close connections that have been idle for 20 seconds
  connect_timeout: 60, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for compatibility
});

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export types for convenience
export type Database = typeof db;

// Helper function to close database connections (useful for testing)
export const closeDB = async () => {
  await sql.end();
};

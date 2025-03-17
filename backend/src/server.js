import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import neo4j from 'neo4j-driver';
import graphRoutes from './routes/graphRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

console.log("NEO4J_URI:", process.env.NEO4J_URI);
console.log("NEO4J_USER:", process.env.NEO4J_USER);
console.log("NEO4J_PASSWORD:", process.env.NEO4J_PASSWORD);

// const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Neo4j Database Connection
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

// Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from Vue frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// Middleware
app.use(express.json());
// app.use(authMiddleware);

// Routes
app.use('/api/graph', graphRoutes(session));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
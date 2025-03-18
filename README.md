# ABN AMRO Assignment

## Description

A web application built as a technical assignment for ABN AMRO. This project demonstrates modern web development practices and clean code principles, featuring both frontend and backend implementations.

## Features

- Feature-rich web application
- Modern UI/UX design
- Responsive layout
- Clean and maintainable code structure
- RESTful API endpoints
- Secure data handling
- Database integration

## Technologies Used

### Frontend

- Frontend Framework: Vue3, D3.js 
- Styling: Tailwind CSS, Postcss
- Testing: vitest

### Backend

- Runtime: Node.js
- Framework: Express.js
- Database: Neo4j
- Authentication: JWT Bearer token

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Database Neo4j

### Installation

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies for both frontend and backend

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

3. Configure environment variables

```bash
# Backend .env file
PORT=3000
NEO4J_URI=bolt://localhost:7687/neo4j
NEO4J_USER=<your_db_username>
NEO4J_PASSWORD=<your_db_password>
AUTH_TOKEN=<your_secure_token>
CORS_ORIGIN=http://localhost:5173

# Frontend .env file
VITE_API_BASE_URL=http://localhost:3000
VITE_API_PATH=api/graph/nodes
VITE_API_TIMEOUT=30000
VITE_AUTH_TOKEN=<your_secure_token>
```

4. Start the development servers

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Database Setup

1. Install Neo4j Desktop as the graph database
2. Create your database
2. Run scripts (scripts/data_file.txt)



### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm run test:unit
```


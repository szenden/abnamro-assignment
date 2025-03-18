import request from 'supertest';
import app from '../src/server.js';

describe('Graph API Endpoints', () => {
    it('should return nodes from the graph database', async () => {
        const res = await request(app)
            .get('/api/graph/nodes')
            .set('Authorization', `Bearer ${process.env.AUTH_TOKEN}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
    });
    
    it('should return 401 for unauthorized access', async () => {
        const res = await request(app)
            .get('/api/graph/nodes');
        expect(res.statusCode).toEqual(401);
    });

    // add test to test the return of the nodes
    it('should return nodes from the graph database', async () => {
        const res = await request(app)
            .get('/api/graph/nodes')
            .set('Authorization', `Bearer ${process.env.AUTH_TOKEN}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
    });
});
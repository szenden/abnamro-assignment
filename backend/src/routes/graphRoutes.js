import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const router = express.Router();

// Get the nodes and their children
export default (session) => {
    router.get('/nodes', async (req, res) => {
        try {

            if(process.env.USE_MOCK_DATA){
                const mockData = JSON.parse(await import('fs').then(fs => fs.promises.readFile('./src/data.json', 'utf8')));
                res.json({ data: mockData });
                return;
            }

            const result = await session.run(`
                MATCH (parent:Node)
                OPTIONAL MATCH (parent)-[:HAS_CHILD]->(child:Node)
                RETURN parent, collect(child) AS children
            `);
    
            // Create a map to store nodes by name
            // Process nodes into a map structure
            const nodeMap = result.records.reduce((map, record) => {
                const parent = record.get('parent').properties;
                const children = record.get('children')
                    .filter(Boolean)
                    .map(child => child.properties);

                map.set(parent.name, {
                    ...parent,
                    children: children
                });
                return map;
            }, new Map());

            // Build hierarchical tree structure
            const buildTree = (nodeName) => {
                const node = nodeMap.get(nodeName);
                if (!node) return null;

                return {
                    ...node,
                    children: node.children.map(child => 
                        nodeMap.has(child.name) ? buildTree(child.name) : child
                    )
                };
            };

            // Get root node (A) and build complete tree
            const rootNodes = [buildTree('A')];
    
            res.json({ data: rootNodes });
        } catch (error) {
            console.error("Neo4j Query Error:", error);  // 🔥 Debugging line
            res.status(500).json({ error: 'Database query failed' });
        }
    });
    return router;
};
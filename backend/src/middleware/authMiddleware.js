export default (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || token !== `Bearer ${process.env.AUTH_TOKEN}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
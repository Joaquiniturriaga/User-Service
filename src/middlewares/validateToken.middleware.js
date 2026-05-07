// The API Gateway (Java) validates the JWT and forwards
// x-user-id and x-user-role headers to this service.
const validateToken = (req, res, next) => {
    console.log('headers recibidos:', req.headers); 
    const userId   = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || userId === 'null') {
        return res.status(401).json({ error: 'Token required' });
    }

    req.user = { id: parseInt(userId), role: userRole };
    next();
};

module.exports = { validateToken };
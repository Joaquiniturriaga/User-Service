const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {

                console.log('>>> authorizeRole req.user:', req.user);
        console.log('>>> allowedRoles:', allowedRoles);
        
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    };
};

module.exports = { authorizeRole };
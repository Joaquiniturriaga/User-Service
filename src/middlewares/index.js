module.exports = {
    ...require('./validateToken.middleware'),
    ...require('./roles.middleware'),
    ...require('./validateUserData.middleware')
};
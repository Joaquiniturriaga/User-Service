require('dotenv').config();
const express = require('express');
const { router } = require('./src/routes/user.routes');
const { validateInternalSecret } = require('./src/middlewares/internalSecret.middleware');
const app = express();
app.use(express.json());

app.use('/api/users', validateInternalSecret, router);

app.get('/', (req, res) => {
    res.send('User service running');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
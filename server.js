'use strict';

const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => console.log(`The server is running on port: ${PORT}`));

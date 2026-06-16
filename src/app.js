const express = require('express');
const app = express();

app.use(express.json());

app.use('/events', require('./routes/events'));
app.use('/registrations', require('./routes/registrations'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
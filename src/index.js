const express = require('express');
const cors = require('cors');

const app = express();
const users = require('./routes/index');

app.use(cors());
app.use(express.json());

users.routes(app);

app.listen(5000);

const express = require('express');
const cors = require('cors');
const app = express();

const fs = require('firebase-admin');
const serviceAccount = require('./key.json');

fs.initializeApp({
 credential: fs.credential.cert(serviceAccount)
});

app.use(cors())
app.use(express.json());

app.use(express.urlencoded({extended: true}));

const routes = require('./routes/v1');

app.use('/api/v1', routes)

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})
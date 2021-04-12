const express = require('express');

const app = express();

app.use((req, res) => {
    res.end('test 2')
});

module.exports = app;
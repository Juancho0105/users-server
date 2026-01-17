const express = require('express');
const path = require('path');
// const cors = require('cors');
require('dotenv').config();

const app = express();

// app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.get('/reset', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running in the port ${PORT}`);
});
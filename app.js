const express = require('express');
const connectDB = require('./config/db');

const app = express();
// Connet Databsase
connectDB();

// initilize body parser buil in
app.use(express.json({extended:false}))

app.get('/', (req, res) => {
  res.send('App running');
});

// define routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server started');
});

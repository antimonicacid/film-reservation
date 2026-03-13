const PORT = process.env.PORT || 3000;

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const verifyJWT = require('./middleware/verifyJWT');


require('dotenv').config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use("/register", require('./routes/register'));
app.use("/login", require('./routes/auth'));
app.use("/refresh", require('./routes/refresh'));

app.use(verifyJWT);
app.use("/film", require('./routes/film'));
app.use("/show", require('./routes/show'));
app.use("/booking", require('./routes/booking'));


app.get('/', (req, res) => {
  res.send('Hello World');
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
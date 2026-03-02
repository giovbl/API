const express = require('express');
var cors = require('cors');
const cookieParser = require('cookie-parser')

const port = 3000;
const app = express();

const authRouter = require('./routes/auth')
const sampleRouter = require('./routes/sample')


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/sample',sampleRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
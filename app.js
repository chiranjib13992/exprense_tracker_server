// require('./config/passportConfig');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB } = require('./config/db');
const app = express();
const userRouter = require('./routers/user.route');
const expenseRouter = require('./routers/expense.route');
const passport = require('passport');
require('./config/passportConfig');

// (Optional) if using sessions:
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow the React app's origin
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Set to true if you are sending cookies or authorization headers
}));



app.use(express.json({
  limit: '400kb'
}));

app.use(express.urlencoded({
  limit: '400kb',
  extended: true
}));

//apis router

app.use('/api', userRouter);
app.use('/api/expense', expenseRouter);
app.use(passport.initialize());

app.use(function (req, res, next) {
  //Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request Method You want to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request header yo want to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
})

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('✅ Server is listening on port ' + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server because DB connection failed.');
    process.exit(1); // optional: exit process if DB fails
  });
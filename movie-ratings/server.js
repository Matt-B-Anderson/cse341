const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./auth'); // use configured passport
const cookieParser = require('cookie-parser');
const path = require('path');

const port = process.env.PORT || 8080;
const app = express();

app.set('trust proxy', 1);
const allowedOrigins = [
  `https://${process.env.RENDER_EXTERNAL_HOSTNAME || ''}`.replace(/\/+$/,''),
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    return cb(null, allowedOrigins.includes(origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app
  .use(bodyParser.json())
  .use(cookieParser())
  .use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      httpOnly: true,
      secure: true,      
      sameSite: 'lax',   
      path: '/'
    }
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.static('public'))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customJs: '/swagger-cred.js', explorer: true }))
  .use('/', require('./routes/index'));

app.get('/', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const name = req.user?.displayName || req.user?.username || 'user';
    return res.send(`Logged in as ${name}`);
  }
  res.send('Logged Out');
});

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => console.log(`Connected to DB and listening on ${port}`));
  }
});

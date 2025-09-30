const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./auth');

const port = process.env.PORT || 8080;
const app = express();

app.set('trust proxy', 1);
const allowedOrigins = [
    'https://movierating-wakw.onrender.com/',
];

app
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use(bodyParser.json())
    .use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
    } 
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(cors({
        origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        return cb(null, allowedOrigins.includes(origin));
        },
        credentials: true,
        methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }))
    .use('/', require('./routes/index'));

app.get('/', (req, res) => {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

mongodb.initDb((err, mongodb) => {
    if (err) {
    console.log(err);
    } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
    }
});
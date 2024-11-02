const express = require('express');
const userRoute = require('./routes/userRoute.js')
const jobRoute = require('./routes/jobRoute.js')
const authRoute = require('./routes/authRoutes.js')
const db = require('./config/database.js')
const session = require('express-session')
const SequelizeStore = require("connect-session-sequelize");
const moment = require('moment-timezone');
const cors = require('cors')

const app = express();

const SequelizeStoreSession = SequelizeStore(session.Store);
const SESS_SECRET = "qwertysaqdunasndjwnqnkndklawkdwk";

const store = new SequelizeStoreSession({
    db: db
});
const TIMEZONE = "Asia/Jakarta";
// (async()=>{
//    await db.sync();
// })();

app.use(session({
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: true,  
    store: store,
    cookie: {
        maxAge: 3600000, // 1 jam
        secure: 'auto'
    }
}));

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use((req, res, next)=> {
    res.setHeader('Date',moment().tz(TIMEZONE).format('ddd, DD MMM YYYY HH:mm:ss [GMT+0700]'));
    next();
})
app.use(authRoute)
app.use(userRoute);
app.use(jobRoute);
app.get('/', (res) => {
    res.send('berhasil');
});

// store.sync();

const APP_PORT = 5100;

app.listen(APP_PORT,()=> {console.log('test')})
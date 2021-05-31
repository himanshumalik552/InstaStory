const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const passport = require('passport');
const dotenv  = require('dotenv');
const morgan = require('morgan');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');



//Load config

dotenv.config({path: './config/config.env'})

//Passport config

require('./config/passport')(passport)


connectDB();

const app = express();
//Logging 
if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}

//Handlebar
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Session
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized:false,
    store: MongoStore.create ({mongoUrl:process.env.MONGO_URI })
}))

//passport middleware

app.use(passport.initialize())
app.use(passport.session())

//Router

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


//Static folder

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000

app.listen(
    PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
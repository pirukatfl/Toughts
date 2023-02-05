const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')


const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

const conn = require('./db/conn')

// Controllers
const ToughtsController = require('./controllers/ToughtController')

// template engine
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.set('views', './views');

// receber resposta no body
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json())

// session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true,
        }
    })
)

// flash messages
app.use(flash())

// publi path
app.use(express.static('public'))

app.use((req, res, next) => {
    if(req.session.userId) {
        res.locals.session = req.session
    }

    next()
})

// Routes

app.use('/', toughtsRoutes)
app.use('/', authRoutes)
app.get('/', ToughtsController.showToughts)

// set session
// { force : true }
conn.sync()
    .then(() => {
        app.listen(3000)
    }).catch((err) => {
        console.log(err)
    })
const path = require('path')
const express = require('express')
const layout = require('express-layout')

const routes = require('./routes')
const app = express()

const bodyParser = require('body-parser')
const validator = require('express-validator')
const cookeParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')

const helmet = require('helmet')
const csrf = require('csurf')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')



/*
* We don’t need to modify our POST request handler as all POST requests
* will now require a valid token by the csurf middleware.
* If a valid CSRF token isn’t provided, a ForbiddenError error will be thrown,
* which can be handled by the error handler defined at the end of server.js.
* https://en.wikipedia.org/wiki/Cross-site_request_forgery
*/
const middlewares = [
  helmet(), // adds some security for HTTP headers (we should ideally be using HTTPS!)
  layout(),
  express.static(path.join(__dirname, 'public')),
  bodyParser.urlencoded(),
  validator(),
  cookieParser(),
  session({
    secret: 'super-secret-key',
    key: 'super-secret-cookie',
    resave: false,
    saveUninitiated: false,
    cookie: {maxAge: 60000},
  }),
  flash(),
  csrf({cookie: true})
]
app.use(middlewares)

app.use('/', routes)

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, () => {
  console.log(`App running at http://localhost:3000`)
})

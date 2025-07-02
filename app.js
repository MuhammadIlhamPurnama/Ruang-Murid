const express = require('express')
const app = express()
const port = 3000
const Controller = require('./controllers/controller')
const session = require('express-session')

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}))
app.use(session({
  secret: 'rahasia ya',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true 
  }
}))

const isLoggedIn = (req, res,next) => {
  try {
    if (req.session.user) {
      next()
    } else {
      const errors = "You must login first :)"
      res.redirect(`/login?errors=${errors}`)
    }
    
  } catch (error) {
    res.send(error)
  }
}



app.get('/', Controller.home)
app.get('/login', Controller.login)
app.post('/login', Controller.postLogin)
app.get('/register', Controller.register)
app.post('/register', Controller.postRegister)

app.use(isLoggedIn)
app.get('/profile', Controller.profile)
app.get('/profile/edit', Controller.editProfile)
app.post('/profile/edit', Controller.postEditProfile)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

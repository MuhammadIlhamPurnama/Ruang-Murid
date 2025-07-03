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

app.get('/logout', Controller.logout)
app.use(isLoggedIn)
app.get('/profile', Controller.profile)
app.get('/profile/edit', Controller.editProfile)
app.post('/profile/edit', Controller.postEditProfile)

app.get('/courses', Controller.showCourses)
app.get('/courses/create', Controller.createCourse)
app.post('/courses/create', Controller.postCreateCourse)
app.post('/courses/:id/enroll', Controller.enrollCourse)
app.get('/my-courses', Controller.showMyCourses)
app.get('/courses/:id/delete', Controller.deleteCourse)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

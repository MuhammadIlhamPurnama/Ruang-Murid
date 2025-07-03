const { Op } = require("sequelize");
const {User, Profile, Category, Course, UserCourse} = require("../models/")
const bcrypt = require('bcryptjs')
const sendEmail = require('../helpers/nodemailer')
class Controller {
  static async home (req, res) {
    try {
      let user = req.session.user
      
      res.render('home', {user})
    } catch (error) {
      res.send(error)
    }
  }
  static async login (req, res) {
    try {
      const {errors} = req.query
      res.render('login', {errors})
    } catch (error) {
      res.send(error)
    }
  }

  static async postLogin (req, res) {
    try {
      const {email, password} = req.body

      let user = await User.findOne({where: {email}})
      
      if (user) {
        let checkPass = bcrypt.compareSync(password, user.password)
        if (checkPass) {

          req.session.user = {
            id: user.id,
            role: user.role
          }

          return res.redirect('/')
        }else {
          const error = "Invalid email/password"
          return res.redirect(`/login?errors=${error}`)
        }
      } else {
        const error = "Invalid email/password"
        return res.redirect(`/login?errors=${error}`)
      }
      
    } catch (error) {
      console.log(error);
      
      res.send(error)
    }
  }

  static async register (req, res) {
    try {
      let {errors} = req.query
      res.render('register', {errors})
    } catch (error) {
      res.send(error)
    }
  }

  static async postRegister (req, res) {
    try {
      const {name, email, password, role} = req.body

      await User.create({name, email, password, role})

      let user = await User.findOne({where: {email}})

      req.session.user = {
        id: user.id,
        role: user.role
      }

      sendEmail(user.email)

      res.redirect('/')
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        let errors = error.errors.map(el => el.message)
        res.redirect(`/register?errors=${errors}`)
      } else {
        res.send(error)
      }
    }
  }

  static async profile (req,res) {
    try {
      let userSession = req.session.user
      let user = await User.findByPk(userSession.id, {
        include: Profile
      })
      res.render('profile', {user})
    } catch (error) {
      res.send(error) 
    }
  }

  static async editProfile (req,res) {
    try {
      let {errors} = req.query
      let userSession = req.session.user

      let userProfile = await Profile.findOne({where: {UserId : userSession.id}})
      console.log(userProfile)
      res.render('edit-profile', {userProfile, errors})
    } catch (error) {
      res.send(error)
    }
  }

  static async postEditProfile (req, res) {
    try {
      let userSession = req.session.user
      let { phone, birthDate, photo, bio} = req.body

      let profile = await Profile.findOne({where: {UserId: userSession.id}})
      
      if (profile) {
        await profile.update({
          phone,
          birthDate,
          photo,
          bio
        })
      } else {
        await Profile.create({
          phone,
          birthDate,
          photo,
          bio,
          UserId : userSession.id
        })
      }
      res.redirect('/profile')
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        let errors = error.errors.map(el => el.message)
        res.redirect(`/profile/edit?errors=${errors}`)
      } else {
        res.send(error)
      }
    }
  }

  static async showCourses (req, res) {
    try {
      let {errors} = req.query
      let {search, notif} = req.query 
      let user = req.session.user
      let courses = await Course.findAll({
        include: Category
      })
      if (search) {
        courses = await Course.findAll({
          include: Category,
          where: {
            title: {
              [Op.iLike]: `%${search}%`
            }
          }
        })
      }
      res.render('courses', {user, courses, errors, notif})
    } catch (error) {
      res.send(error)
    }
  }

  static async logout (req, res) {
    try {
      delete req.session.user
      res.redirect('/')
    } catch (error) {
      res.send(error)
    }
  }

  static async createCourse (req, res) {
    try {
      let categories = await Category.findAll()
      res.render('create-course', {categories})
    } catch (error) {
      res.send(error)
    }
  }

  static async postCreateCourse (req, res) {
    try {
      let {title, description, CategoryId} = req.body
      await Course.create({
        title,
        description,
        CategoryId
      })
      res.redirect('/courses')
    } catch (error) {
      res.send(error)
    }
  }

  static async enrollCourse (req, res) {
    try {
      let {id} = req.params
      let user = req.session.user
      let check = await UserCourse.findOne({
        where: {
          UserId: user.id,
          CourseId: id
        }
      })
      if (!check) {
        await UserCourse.create({
          UserId: user.id,
          CourseId: id,
          enrolledAt: new Date(),
          progress: 'in progress'
        })    
      } else {
        res.redirect('/courses?errors=already enroll this course')
      }
      res.redirect('/courses')
    } catch (error) {
      res.send(error)
    }
  }

  static async showMyCourses (req, res) {
    try {
      let {id} = req.session.user
      let user = await User.findAll( {
        include: {
          model: UserCourse,
          include: {
            model: Course,
            include: {
              model: Category
            }
          }
        }, 
        where: {
          id
        }
      })
      res.render('my-course', {user:user[0].UserCourses})  
    } catch (error) {
      res.send(error)
    }
  }

  static async deleteCourse (req, res) {
    try {
      let {id} = req.params
      let data = await Course.getCourseById(id)
      await data.destroy()
      res.redirect(`/courses?notif=course ${data.title} has been deleted`)
    } catch (error) {
      res.send(error)
    }
  }
}

module.exports = Controller
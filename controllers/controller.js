const {User} = require("../models/")
const bcrypt = require('bcryptjs')
class Controller {
  static async home (req, res) {
    try {
      res.render('home')
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
      res.send(error)
    }
  }

  static async register (req, res) {
    try {
      res.render('register')
    } catch (error) {
      res.send(error)
    }
  }

  static async postRegister (req, res) {
    try {
      const {name, email, password, role} = req.body

      await User.create({name, email, password, role})

      res.redirect('/')
    } catch (error) {
      res.send(error)
    }
  }
}

module.exports = Controller
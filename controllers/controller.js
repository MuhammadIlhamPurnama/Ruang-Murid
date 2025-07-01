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
      
    } catch (error) {
      res.send(error)
    }
  }
  static async register (req, res) {
    try {
      
    } catch (error) {
      res.send(error)
    }
  }
}

module.exports = Controller
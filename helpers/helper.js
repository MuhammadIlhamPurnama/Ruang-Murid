const bcrypt = require('bcryptjs')

const hashPassword = (user) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
      }

module.exports = hashPassword
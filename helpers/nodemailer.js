const nodemailer = require('nodemailer');

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ilhampurnama678@gmail.com', 
      pass: 'vgxdrilhicaznrsd'
    }
  });

  const mailOptions = {
    from: 'ilhampurnama678@gmail.com', 
    to: 'haritzah.farizi@gmail.com', 
    subject: 'Halo dari Team Ruang Murid', 
    text: 'Email ini dikirim pakai Nodemailer!'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email berhasil dikirim:', info.response);
  } catch (error) {
    console.log('Gagal kirim email:', error);
  }
}

module.exports = sendEmail

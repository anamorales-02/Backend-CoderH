import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let configOptions = {
  service: 'GMAIL', // Cambia esto según el proveedor de correo que estés utilizando
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
};

const transporter = nodemailer.createTransport(configOptions);

function  sendEmail(email, subject, text) {
  transporter. sendEmail({
    encoding: 'utf8',
    from: 'noreply@example.com', // Cambia la dirección de remitente según tu configuración
    to: email,
    subject: subject,
    text: text,
  });
}

export { sendEmail };

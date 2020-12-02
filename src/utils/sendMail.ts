import nodemailer from 'nodemailer';

const sendMail = async (params: {
  to: string[];
  subject: string;
  text: string;
  html: string;
}): Promise<void> => {
  const { to, subject, text, html } = params;

  const mailer = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_ID, // generated ethereal user
      pass: process.env.MAILER_PASSWORD, // generated ethereal password
    },
  });

  const info = await mailer.sendMail({
    from: process.env.MAILER_ID, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });

  return info;
};

export default sendMail;

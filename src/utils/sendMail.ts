import nodemailer from 'nodemailer';

const sendMail = async (
  _to: string[],
  _subject: string,
  _text: string,
  _html: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // code goes here
    try {
      const mailer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAILER_ID, // generated ethereal user
          pass: process.env.MAILER_PASSWORD, // generated ethereal password
        },
      });

      const info = mailer.sendMail({
        from: process.env.MAILER_ID, // sender address
        to: _to, // list of receivers
        subject: _subject, // Subject line
        text: _text, // plain text body
        html: _html, // html body
      });
      resolve(info);
    } catch (err) {
      reject(err);
    }
  });
};

export default sendMail;

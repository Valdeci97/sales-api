import nodemailer from 'nodemailer';

type MailType = {
  to: string;
  body: string;
};

export default class Mail {
  public static async sendMail({ to, body }: MailType): Promise<void> {
    const account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
    const message = await transporter.sendMail({
      from: 'dev@sales-api.com',
      to,
      subject: 'Redefina a senha da sua conta',
      text: body,
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}

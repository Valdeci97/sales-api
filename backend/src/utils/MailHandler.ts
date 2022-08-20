import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import { MailType, MailTemplate } from '../types/Mail';

export default class MailHandler {
  public static async sendMail(mail: MailType): Promise<void> {
    const account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass },
    });
    const message = await transporter.sendMail({
      from: {
        name: mail.from?.name || 'Equipe sales api',
        address: mail.from?.email || 'sales-api@api.com',
      },
      to: { name: mail.to.name, address: mail.to.email },
      subject: mail.subject,
      html: await MailHandler.parseMail(mail.templateData),
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }

  private static async parseMail({
    file,
    args,
  }: MailTemplate): Promise<string> {
    const content = await fs.readFile(file, 'utf-8');
    const parsedMail = handlebars.compile(content);
    return parsedMail(args);
  }
}

type MailContact = {
  name: string;
  email: string;
};

type MailArgs = {
  [key: string]: string | number;
};

export type MailTemplate = {
  file: string;
  args: MailArgs;
};

export type MailType = {
  from?: MailContact;
  to: MailContact;
  subject: string;
  templateData: MailTemplate;
};

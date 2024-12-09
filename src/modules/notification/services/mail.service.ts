import { BadRequestException, Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";

@Injectable()
export class EmailNotificationService {
  constructor(private readonly mailerService: MailerService, private readonly logger: TracingLogger) {
    this.logger.setContext(EmailNotificationService.name);
  }

  async sendEmailNotification(receiver: string, content: string): Promise<void> {
    if(!receiver){
      this.logger.error(`Receiver "${receiver}" not found`);
      throw new BadRequestException('Receiver mail not found');
    }
    await this.mailerService.sendMail({
      to: receiver,
      subject: 'Login Code',
      html: this.getLoginHtmlTemplate(content)
    });
  }


  private getLoginHtmlTemplate(param: any){
    return  `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .email-container {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        .email-container h1 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 16px;
        }
        .email-container p {
          color: #555555;
          font-size: 16px;
          margin-bottom: 24px;
        }
        .email-container strong {
          font-size: 20px;
          color: #2c7be5;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #aaaaaa;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1>Your Login Code</h1>
        <p>Your login code is: <strong>${param}</strong></p>
        <div class="footer">
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  }
}
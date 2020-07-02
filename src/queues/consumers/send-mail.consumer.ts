import { Process, Processor } from '@nestjs/bull';

import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Job } from 'bull';
import { SentMessageInfo } from 'nodemailer';

import { QueuesList } from '../queues-list';

@Processor(QueuesList.SEND_MAIL)
export class SendMailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process()
  async handle(job: Job<ISendMailOptions>): Promise<SentMessageInfo> {
    const { data: options } = job;

    const sentMessageInfo = await this.mailerService.sendMail(options);

    return sentMessageInfo;
  }
}

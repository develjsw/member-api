import { Injectable } from '@nestjs/common';
import { IncomingWebhook } from '@slack/webhook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackService {
    private webhook: IncomingWebhook;

    constructor(private readonly configService: ConfigService) {
        this.webhook = new IncomingWebhook(this.configService.get('config-info.webhook.slack.url'));
    }

    /**
     * slack webhook 기본
     * @param msg - 내용
     */
    async sendMessage(msg: string): Promise<void> {
        await this.webhook.send({
            text: msg
        });
    }

    /**
     * slack webhook 부분 커스터마이징
     * @param title - 제목
     * @param text - 내용
     * @param color - 색상
     */
    async sendCustomMessage(title: string, text: string, color?: string): Promise<void> {
        const custom = {
            title: title,
            text: text,
            ...(color && { color })
        };

        await this.webhook.send({
            attachments: [custom]
        });
    }
}

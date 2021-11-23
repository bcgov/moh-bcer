import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TextService } from './textService';

@Injectable()
export class NotificationService {
    async sendText(){
        const textService = new TextService();
        const result = await textService.sendMessage("Hello World", []);
    }
}

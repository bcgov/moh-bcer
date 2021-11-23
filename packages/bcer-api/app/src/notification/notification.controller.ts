import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard, RoleGuard } from "src/auth/auth.module";
import { NotificationService } from "./notification.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService){}
    @Post()
    async sendMessage(){
        await this.notificationService.sendText()
    }
}
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class NotificationDTO {
    @ApiProperty({
        description: 'Message to be send',
        example: 'This is a test message',
    })
    @IsString()
    @MaxLength(612)
    message: string;

    @ApiProperty({
        description: 'Title of the notification',
        example: 'Alert!'
    })
    @IsString()
    @IsOptional()
    title?: string;
}
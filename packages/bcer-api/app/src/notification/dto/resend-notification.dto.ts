import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { RecipientType } from "../enum/recipient.enum";

export class ResendNotificationDTO {
    @IsUUID()
    id: string;

    @IsEnum(RecipientType)
    @IsOptional()
    recipient: RecipientType;
}
import { ApiProperty } from "@nestjs/swagger";
import { BusinessRO } from "src/business/ro/business.ro";

export class SubscriptionRO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    businessId?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    phoneNumber1: string;

    @ApiProperty()
    phoneNumber2: string;

    @ApiProperty()
    confirmed: boolean;

    @ApiProperty()
    business?: BusinessRO;
}
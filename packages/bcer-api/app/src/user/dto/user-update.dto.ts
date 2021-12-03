import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsUUID, ValidateIf } from "class-validator";
import { UserStatusEnum } from "../enums/user-status.enum";

export class UserUpdateDto {
    @ApiProperty({description: 'User ID'})
    @IsUUID()
    userId: string;

    @ValidateIf(u => !u.userStatus || u.newBusinessId)
    @ApiProperty({description: 'New business id which will be assigned to user'})
    @IsUUID()
    newBusinessId: string;

    @ValidateIf(u => !u.newBusinessId || u.userStatus)
    @ApiProperty({description: 'User Status'})
    @IsEnum(UserStatusEnum)
    @IsOptional()
    userStatus: UserStatusEnum;
}
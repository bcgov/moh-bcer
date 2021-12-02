import { IsUUID } from "class-validator";

export class BusinessMergeDTO {
    @IsUUID()
    targetBusinessId: string;

    @IsUUID()
    sourceBusinessId: string;
}
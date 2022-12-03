import { IsOptional, IsString, IsUUID, Length, ValidateIf } from "class-validator";

export class NoteDTO {
  @IsString()
  @Length(0, 1024)
  content: string;

  @IsUUID()
  @IsOptional()
  businessId?: string;

  @ValidateIf(note => !note.businessId || note.locationId)
  @IsUUID()
  locationId: string;
}
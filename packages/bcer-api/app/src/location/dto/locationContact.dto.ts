import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, isArray, IsEmail, IsPhoneNumber, IsString, IsUUID, Matches, Min, MinLength } from "class-validator";

export class LocationContactDTO {
  @ApiProperty({description: "Array of location ids to be updated"})
  @IsUUID("all", { each: true })
  @IsArray()
  @ArrayNotEmpty()
  ids: string[];

  @ApiProperty({description: "Common email address"})
  @IsEmail()
  email: string;

  @ApiProperty({description: "Common phone number"})
  @Matches(/^(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/)
  phone: string;
}
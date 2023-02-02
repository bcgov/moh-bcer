import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class FavouriteDto {
    @ApiProperty({
        description: 'Title of favourite',
        example: 'Locations with valid NOI',
    })
    @IsString()
    @MaxLength(50)
    title: string;

    @ApiProperty({
        description: 'Search param',
        example: '{noi_report: submitted}'
    })
    @IsString()
    searchParams: string;
}
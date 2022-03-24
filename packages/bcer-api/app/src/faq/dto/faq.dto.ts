import { IsJSON, IsString } from "class-validator";

export class FaqDTO {
  
  @IsString()
  id: string;

  @IsJSON()
  content: JSON;
}
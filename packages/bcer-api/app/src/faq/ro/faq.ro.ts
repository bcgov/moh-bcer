import { ApiProperty } from "@nestjs/swagger";
import { UserRO } from "src/user/ro/user.ro";

export class FaqRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: JSON;
}
import { ApiProperty } from "@nestjs/swagger";
import { UserRO } from "src/user/ro/user.ro";

export class NoteRO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  user: UserRO;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class CreateTableDto {
  @ApiProperty({ example: 1, description: "The unique number assigned to the dine-in table" })
  @IsInt()
  @Min(1)
  number: number;
}

import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";

export class GetUserDto{
  //@IsInt()
  @IsNotEmpty()
  page: number;

  //@IsInt()
  limit?: number;

 // @IsString()
  //@Length(6, 20)
  username?: string;

  //@IsInt()
  role?: number; // !下拉框选择

  //@IsInt()
  gender?:number;
}
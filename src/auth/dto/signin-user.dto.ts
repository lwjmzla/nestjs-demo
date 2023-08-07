import { IsNotEmpty, IsString, Length } from "class-validator";

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    // $value  传入值
    // $property  属性名
    // $target  当前类
    // $constraint1  最小长度
    message: `用户名长度必须在$constraint1到$constraint2之间`
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;
}
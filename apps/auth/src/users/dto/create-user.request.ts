import {IsEmail, IsIn, IsNotEmpty, IsString} from 'class-validator';
import {UserRole} from "../user-roles.enum";

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(UserRole))
  role: string;
}

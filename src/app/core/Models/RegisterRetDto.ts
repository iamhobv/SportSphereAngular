import { UserRoles } from "./Enums";

export interface RegisterRetDto {
  UserId: string;
  Email: string;
  Message: string;
  Role: UserRoles;
}
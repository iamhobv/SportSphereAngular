import { UserRoles } from "./Enums";

export interface LoginRetDTO {
  userId: string;
  email: string;
  userName: string;
  role: UserRoles;
  token: string;
  expiresAt: string; 
}

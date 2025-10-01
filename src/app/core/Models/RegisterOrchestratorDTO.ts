import { GenderType, UserRoles } from './Enums';

export interface AddProfileOrchestratorDto {
  bio?: string;
  country?: string;
  city?: string;
  sport?: string;
  position?: string;
  heightCm?: number;
  weightKg?: number;
}

// Match RegisterDTO
export interface RegisterDTO {
  fullName: string;
  email: string;
  role: UserRoles;
  gender: GenderType;
  dateOfBirth: string;   // ISO string (e.g. "2000-05-15")
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterOrchestratorDTO {
  registerData: RegisterDTO;
  profile: AddProfileOrchestratorDto;
  file: File; // IFormFile → File in JS
}
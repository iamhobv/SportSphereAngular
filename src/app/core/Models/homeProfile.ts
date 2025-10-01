export interface UserHomeProfileVm {
  fullName: string;
  userId: string;
  bio: string;
  role: string;
  profileImage: string;
  profileImageURL: string;
  sport?: string;
  city: string;
  country: string;
  profileID: number;
  isIFollow: boolean;
  isIBlock: boolean;

}
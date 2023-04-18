export type Role = 'admin' | 'admin';

export interface File {

}

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  created: string;
  updated: string;
  profilePhoto: File | null;
  role: Role;
}

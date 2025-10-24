export interface Roles {
  id: number;
  name: string;
  selectedSystemServices: number[];
}
export interface Users {
  id: number;
  email: string;
  fullName: string;
  userStatusId: number;
  userRoles: UserRole[];
}

export interface UserRole {
  roleId: number;
}

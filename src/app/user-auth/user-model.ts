export interface AuthResult {
  statusCode: number;
  messages: any[];
  result: User;
}

export class User {
  constructor(
    public email: string,
    public name: string,
    public surname: string,
    private _token: string,
    public services: any[],
    public userStatusId: number
  ) {}
  get token() {
    return this._token;
  }

  get fullName() {
    return `${this.name} ${this.surname}`;
  }
  static createUserInstance(data: any): User {
    const { email, name, surname, token, services, userStatusId } = data;
    return new User(email, name, surname, token, services, userStatusId);
  }
  static createUserInstanceFromLocalStorage(data: any): User {
    const { email, name, surname, _token, services, userStatusId } = data;
    return new User(email, name, surname, _token, services, userStatusId);
  }
}

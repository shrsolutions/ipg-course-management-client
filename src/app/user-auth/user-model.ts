export interface AuthResult {
  statusCode: number;
  messages: any[];
  result: User;
}

export class User {
  constructor(
    public phoneNumber: string,
    public name: string,
    public surname: string,
    private _token: string,
    private _refreshToken: string,
    public services: any[],
    public userStatusId: number
  ) {}
  get token() {
    return this._token;
  }

    get refreshToken() {
    return this._refreshToken;
  }

  get fullName() {
    return `${this.name} ${this.surname}`;
  }
  static createUserInstance(data: any): User {
    const { phoneNumber, name, surname, token,refreshToken, services, userStatusId } = data;
    return new User(phoneNumber, name, surname, token,refreshToken, services, userStatusId);
  }
  static createUserInstanceFromLocalStorage(data: any): User {
    const { phoneNumber, name, surname, _token, _refreshToken, services, userStatusId } = data;
    return new User(phoneNumber, name, surname, _token, _refreshToken, services, userStatusId);
  }
}

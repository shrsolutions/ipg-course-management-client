export interface AuthResult {
    statusCode: number
    messages: any[]
    result: User
  }
  
  export class User {

    constructor(
        public email: string,
        public name: string,
        public surname: string,
        private _token: string,
        public services: any[]
        
    ){}
    
    get token(){
        return this._token
    }

  }
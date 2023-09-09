import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, exhaustMap, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthResult, User } from './user-model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

   baseUrl = environment.apiUrl;
   user = new BehaviorSubject<User>(null)


  constructor(
    private http:HttpClient
  ) { }

  signup(registerModel){

    const formData = new FormData();
    formData.append("Email", registerModel.Email);
    formData.append("Password", registerModel.Password);
    formData.append("Name", registerModel.Name);
    formData.append("Surname", registerModel.Surname);
    formData.append("Patronymic", registerModel.Patronymic);
    formData.append("DateOfBirth", registerModel.DateOfBirth);
    formData.append("Gender", registerModel.Gender);

      return  this.http.post<AuthResult>(`${this.baseUrl}app/users/register`,formData).pipe(
        catchError(this.handleError),
        tap(resData => this.handleAuthentication(resData))
      )
  }

  confirmCode(confirmCode: string) {
    return this.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (user ? user.token : ''),
        });
        const options = { headers };

        return this.http.post<AuthResult>(
          `${this.baseUrl}app/users/confirm-email/${confirmCode}`,
          null,
          options
        );
      })
    );
  }


  private handleError(errorRes:HttpErrorResponse){
    console.log(errorRes)
    let errorMessage = "An Unknown error occured!"
    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(userData:AuthResult){
    const {email,name,surname,token,services} = userData.result
    const user = new User(email,name,surname,token,services);
    this.user.next(user);
  }
}


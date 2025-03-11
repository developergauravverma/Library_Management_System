import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';
import { Book, User, UserType } from '../../models/models';

export interface loginParam {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = 'http://localhost:5218/api/Library/';
  userStatus: Subject<string> = new Subject();

  constructor(private http: HttpClient, private jwt: JwtHelperService) {}

  register(user: any): Observable<string> {
    return this.http.post(this.baseUrl + 'Register', user, {
      responseType: 'text',
    });
  }

  login(param: loginParam): Observable<string> {
    let p = new HttpParams()
      .append('email', param.email)
      .append('password', param.password);

    return this.http.get(this.baseUrl + 'Login', {
      params: p,
      responseType: 'text',
    });
  }

  IsLoggedIn(): boolean {
    if (
      localStorage.getItem('access_token') != null &&
      !this.jwt.isTokenExpired()
    )
      return true;
    return false;
  }

  GetUserInfo(): User | null {
    if (!this.IsLoggedIn()) return null;
    let decodedToken = this.jwt.decodeToken();
    let user: User = {
      id: decodedToken.id,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      email: decodedToken.email,
      mobileNumber: decodedToken.mobileNumber,
      userType: UserType[decodedToken.userType as keyof typeof UserType],
      accountStatus: decodedToken.accountStatus,
      createOn: decodedToken.createOn,
      password: '',
    };
    return user;
  }

  loggedOut(): void {
    localStorage.removeItem('access_token');
    this.userStatus.next('loggedOff');
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl + 'GetBooks');
  }
}

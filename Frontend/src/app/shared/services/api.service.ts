import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, Subject } from 'rxjs';
import { Book, BookCategory, Order, User, UserType } from '../../models/models';

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
      createOn: decodedToken.createdOn,
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

  OrderBook(book: Book): Observable<string> {
    let userId = this.GetUserInfo()!.id;
    let param = new HttpParams()
      .append('userId', userId)
      .append('bookId', book.id);
    return this.http.post(this.baseUrl + 'OrderBook', null, {
      params: param,
      responseType: 'text',
    });
  }

  GetOrdersOfUser(userId: number) {
    let param = new HttpParams().append('userId', userId);
    return this.http
      .get<any>(this.baseUrl + 'GetOrdersOfUser', {
        params: param,
      })
      .pipe(
        map((orders) => {
          let newOrders = orders.map((order: any) => {
            let newOrder: Order = {
              id: order.id,
              userId: order.userId,
              userName: `${order.user.firstName} ${order.user.lastName}`,
              bookId: order.bookId,
              bookTitle: order.book.title,
              orderDate: order.orderDate,
              returned: order.returned,
              returnDate: order.returned,
              finePaid: order.finePaid,
            };
            return newOrder;
          });
          return newOrders;
        })
      );
  }

  GetFineToPay(order: Order): number {
    let today = new Date();
    let orderDate = new Date(Date.parse(order.orderDate));
    orderDate.setDate(orderDate.getDate() + 10);
    if (orderDate.getTime() < today.getTime()) {
      let diff = today.getTime() - orderDate.getTime();
      let days = Math.floor(diff / (1000 * 86400));
      return days * 50;
    }
    return 0;
  }

  AddNewCategory(category: BookCategory): Observable<string> {
    return this.http.post(this.baseUrl + 'AddNewCategory', category, {
      responseType: 'text',
    });
  }

  GetBookCategory(): Observable<BookCategory[]> {
    return this.http.get<BookCategory[]>(this.baseUrl + 'GetBookCategory');
  }

  AddNewBook(book: Book): Observable<string> {
    return this.http.post(this.baseUrl + 'AddNewBook', book, {
      responseType: 'text',
    });
  }

  DeleteBookApi(bookId: number): Observable<string> {
    return this.http.delete(this.baseUrl + 'DeleteBooks', {
      params: new HttpParams().append('bookId', bookId),
      responseType: 'text',
    });
  }

  returnBook(userId: number, bookId: number, fine: number): Observable<string> {
    return this.http.get(this.baseUrl + 'ReturnBook', {
      params: new HttpParams()
        .append('userId', userId)
        .append('bookId', bookId)
        .append('fine', fine),
      responseType: 'text',
    });
  }
}

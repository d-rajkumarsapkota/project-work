import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { DataService } from '../app/services/data.service';

export class AppHttpInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errMsg: any;
          // Client Side Error
          if (error.error instanceof ErrorEvent) {
            console.error('INTERCEPTOR ',error);
            // errMsg = `Error: ${error.error.message}`;
            errMsg = `${error.error.message}`;
          }
          // Server Side Error
          else { 
            // errMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;
            errMsg = `${error.error.message}`;            
          }
          return throwError(errMsg);
        })
      )
  }
}
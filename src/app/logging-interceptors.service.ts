import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class LoggingInterceptorsService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler){
    console.log("outgoing request");
    console.log(req.url);

    return next.handle(req).pipe(
      tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Response){
          console.log('logging response arrived');
          console.log(event.body);
        }
      })
    );
  }
}

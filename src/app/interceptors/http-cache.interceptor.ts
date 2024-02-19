import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "environments/environment";
import { HTTP_CONTEXT } from "app/models/tokens";

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private readonly _cacheDurationTime = environment.cacheDuration;

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const { zip, call } = req.context.get(HTTP_CONTEXT);
    if (zip && call) {
      const cachedResponse = this._getCachedResponse(`${zip}_${call}`);
      if (cachedResponse) {          
        return of(new HttpResponse<any>(cachedResponse));    
      }
    }
    return this._sendRequest(req, next, `${zip}_${call}`);
  }

  private _sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    key: string
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this._setCachedResponse(key, event.clone());
        }
      })
    );
  }


  private _setCachedResponse(key: string, response: HttpResponse<any>) {
    const storageItem = {
      data: response,
      timestamp: new Date(),
    };
    localStorage.setItem(key, JSON.stringify(storageItem));
  }
  private _getCachedResponse(key: string) {
    /**
     * I choose to evaluate _cacheDurationTime here (get) and not in the _setCachedResponse method (set)
     * In this way is more easy to change the cache duration (configurable) and see correct expiration on cache records.
     * If we directly set the cache expiration time on setter, change to the duration of cache wont affect already setted records
     * */
    const storageItem = JSON.parse(
      localStorage.getItem(key)
    );
    if (storageItem) {
      const timestamp = new Date(storageItem.timestamp);
      timestamp.setSeconds(timestamp.getSeconds() + this._cacheDurationTime);
      const currentDate = new Date();
      if (currentDate < timestamp) {
        return storageItem.data;
      }
    }
    return undefined;
  }
}

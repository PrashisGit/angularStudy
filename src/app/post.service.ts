import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { Subject, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  error = new Subject<string>();
  constructor(private http: HttpClient){}

  createAndStorePost(title: string, content: string){
    const postData: Post = {title: title, content: content};
    this.http.post<{name: string}>('https://httpapi-65724.firebaseio.com/posts.json',
      postData,
      {
        observe: 'response'
      }

    )
    .subscribe(resposeData => {
      console.log(resposeData);
    }, error => {
      this.error.next(error.message);
    });
  }

  fetchPosts(){
    //using pipe operator to convert data into map and dn subscribe to map data
    let searchParam = new HttpParams();
    searchParam = searchParam.append('print','pretty');
    searchParam = searchParam.append('custom','key');
    return this.http
    .get<{[key: string]: Post}>('https://httpapi-65724.firebaseio.com/posts.json',
    {
      headers: new HttpHeaders({'Custom-Header': 'Hello Header'}),
      params: searchParam
    })
    .pipe(
      map(responseData => {
      const postArray: Post[] = [];
      for (const key in responseData) {
        if(responseData.hasOwnProperty(key)){
          postArray.push({ ...responseData[key], id: key});
        }
      }
      return postArray;
    }),
    catchError(errorRes =>{
      //send some analytic server
      return throwError(errorRes);
    }));
  }

  clearAllPosts(){
    return this.http.delete('https://httpapi-65724.firebaseio.com/posts.json',
    {
      observe: 'events',
      responseType:'json'
    }).pipe(tap(event => {
      if(event.type === HttpEventType.Sent){
        console.log(event);
      }
      if(event.type === HttpEventType.Response){
        console.log(event.body);
      }
    }));
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {

  loadPosts:Post [] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;
  constructor(private http: HttpClient, private postService: PostService){}

  ngOnInit(){
    this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts =>{
      this.isFetching = false;
      this.loadPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    });
  }
  onCreatePost(postData: Post){
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPost(){
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts =>{
      this.isFetching = false;
      this.loadPosts = posts;
    });
  }

  onClearPost(){
    this.postService.clearAllPosts().subscribe(() =>{
      this.loadPosts = [];
    }, error => {
      this.error = error.message;
    });
  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

}

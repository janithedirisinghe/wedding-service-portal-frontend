import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PostModel } from "../models/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){}

    createPost(post: PostModel): Observable<any> {
            return this.http.post<PostModel>(`${this.baseUrl}/posts`, post, {
              withCredentials: true
            });
        }
}

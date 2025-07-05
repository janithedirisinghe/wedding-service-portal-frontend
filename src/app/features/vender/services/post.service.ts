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

    createPost(postFormData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/posts`, postFormData, {
      withCredentials: true
    });
}

getPostsByVendorId(vendorId: number): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.baseUrl}/posts/vendor/${vendorId}`, {
      withCredentials: true
    });
}

}

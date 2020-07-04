import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../_models/user';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private alertify: AlertifyService) { }

  getUsers(page?, itemsPerPage?, userParams?, likesParams?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();

    if (page != null) {
      params = params.append('pageNumber', page);
    }

    if (itemsPerPage != null) {
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParams === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParams === 'Likees') {
      params = params.append('likees', 'true');
    }

                                                         // TEMPLATE: tell GET to pass back the full response, not just the body
    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  get(id: number): Observable<User> {
    this.alertify.message('top of the get: ' + id);
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  update(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?: number, size?: number, container?: string) {
    this.alertify.message('Top of UserService:getMessages()');
    let parameters = new HttpParams();

    if (container != null) { parameters = parameters.append('MessageContainer', container); }
    if (page != null) { parameters = parameters.append('pageNumber', page.toLocaleString()); }
    if (size != null) { parameters = parameters.append('pageSize', size.toLocaleString()); }

    // pipe() function in RxJS: you can use pipes to link operators together. Pipes let you combine multiple functions
    // into a single function. The pipe() function takes as its arguments the functions you want to combine, and returns
    // a new function that, when executed, runs the composed functions in sequence. https://angular.io/guide/rx-library
    // (search for pipes in this URL, you can find the same)
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    const url = this.baseUrl + 'users/' + id + '/messages';
    const response = this.http.get<Message[]>(url, {observe: 'response', params: parameters}); // full reponse, not just the body
    const transformed = response.pipe(
      map(resp => {
        paginatedResult.result = resp.body; // set paginated result to the body of the response

        if (resp.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(resp.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );

    return transformed;

    // return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', { observe: 'response', params })
    //   .pipe(
    //     map(resp => {
    //       paginatedResult.result = resp.body;
    //       if (resp.headers.get('Pagination') !== null) {
    //         paginatedResult.pagination = JSON.parse(resp.headers.get('Pagination'));
    //       }

    //       return paginatedResult;
    //     })
    //   );
  }

  getMessageThread(id: number, recipientId: number) {
    this.alertify.message('Top of UserService:getMessageThread()');
    const url = this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId;

    return this.http.get<Message[]>(url);
  }

  sendMessage(id: number, message: Message) {
    this.alertify.message('UserService:sendMessage - id=' + id + ' message=' + message.content);
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number) {
    this.alertify.message('delete: ' + this.baseUrl + 'users/' + userId + '/messages/' + id);
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, messageId: number) {
    this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
      .subscribe();
  }
}

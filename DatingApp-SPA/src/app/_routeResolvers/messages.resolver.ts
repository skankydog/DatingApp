import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

    constructor(private router: Router, private userService: UserService,
                private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        this.alertify.message('Top of MessagesResolver:resolve()');
        const obs = this.userService.getMessages(this.authService.decodedToken.nameid, 1, 5, 'Unread');
        return obs
            .pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving messages');
                    this.router.navigate(['/home']);

                    return of(null);
                })
        );
    }
}

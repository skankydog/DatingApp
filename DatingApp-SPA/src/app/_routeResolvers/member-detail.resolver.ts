import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        this.alertify.message('About to retrieve detail data');
        this.alertify.message('id: ' + route.params['id']);
        const obs = this.userService.get(route.params['id']);
        this.alertify.message('about to pipe()');
        const piped = obs.pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving detail data');
                this.router.navigate(['/members']);

                return of(null);
            }));
        this.alertify.message('about to return');
        return piped;
    }
}

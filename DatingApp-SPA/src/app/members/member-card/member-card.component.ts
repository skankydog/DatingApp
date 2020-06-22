import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(private authService: AuthService, private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number) {
    console.log('ths user you are trying to like is: ' + id);
    const observable = this.userService.sendLike(this.authService.currentUser.id, id);

    observable.subscribe(
      good => { this.alertifyService.success('You have liked: ' + this.user.knownAs); },
      bad => { this.alertifyService.error(bad); });
  }
}

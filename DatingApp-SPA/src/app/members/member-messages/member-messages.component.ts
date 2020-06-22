import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {

  }

  load() {
    const currentUserId = +this.authService.decodedToken.nameId; // + makes it a type of number, not any
    const obs = this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap(msgs => {
          for (let i = 0; i < SVGSVGElement.length; i++) {
            if (msgs[i].isRead === false && msgs[i].recipientId === currentUserId) {
              this.userService.markAsRead(currentUserId, msgs[i].id);
            }
          }
        })
      );

    obs.subscribe(msgs => {
      this.messages = msgs;
    }, err => {
      this.alertify.error(err);
    });
  }

  send() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe((msg: Message) => {
        this.messages.unshift(msg);
        this.newMessage.content = ''; // resets the form, apparently
      }, err => {
        this.alertify.error(err);
      });
  }
}

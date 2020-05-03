import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('edit_form_html_name', {static: true}) editFormRef: NgForm; // TEMPLATE: ref form from html, reference from an NgForm variable
  user: User;
  photoUrl: string;

  // TEMPLATE: Use the below snippet to catch the user closing the browser or navigating off the site
  @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
      if (this.editFormRef.dirty) {
        $event.returnValue = true;
      }
    }

  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
              private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    // TEMPLATE: Route resolver
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    this.authService.currentPhotoUrl.subscribe(pUrl => this.photoUrl = pUrl);
  }

  updateUser() {
    this.userService.update(this.authService.decodedToken.nameid, this.user).subscribe(
      next => {
        this.alertify.success('Profile updated successfully');
        this.editFormRef.reset(this.user);
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}

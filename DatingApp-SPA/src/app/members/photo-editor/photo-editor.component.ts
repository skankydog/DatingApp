import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';
import { Photo } from '../../_models/photo';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  baseUrl = environment.apiUrl; // Link to the base environment - depending on mode, you may get prod or dev items back
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  response: string;
  currentMain: Photo;
  photoUrl: string;

  constructor(private authService: AuthService, private userService: UserService, private alertifyService: AlertifyService) {}

  ngOnInit() {
    this.initUploader();

    this.authService.currentPhotoUrl.subscribe(pUrl => this.photoUrl = pUrl);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; }; // Tp get around a CORS issue

    this.hasBaseDropZoneOver = false;
    this.response = '';
    this.uploader.response.subscribe( res => this.response = res );

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      console.log('Successful upload of the file');
      if (response) {
        console.log('### response: ' + response);

        // convert the response to JSON
        const responseAsJSON: Photo = JSON.parse(response);

        // create a Photo object and populate with repsonse details
        const photo = {
          id: responseAsJSON.id,
          url: responseAsJSON.url,
          dateAdded : responseAsJSON.dateAdded,
          description: responseAsJSON.description,
          isMain: responseAsJSON.isMain
        };

        this.photos.push(photo); // add it to the array

        if (photo.isMain) {
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url; // yuck
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser)); // yuck
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      console.log('Settng photo to main');

      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;

      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url; // yuck
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser)); // yuck

    }, error => {
      this.alertifyService.error(error);
    });
  }

  deletePhoto(photo: Photo) {
    this.userService.deletePhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      console.log('Deleting photo');

      // remove the deleted one from the typescript array
      this.photos = this.photos.filter(p => p.id !== photo.id);

    }, error => {
      this.alertifyService.error(error);
    });
  }
}

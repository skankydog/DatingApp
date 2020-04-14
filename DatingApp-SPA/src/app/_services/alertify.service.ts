import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      } else {}
    });
  }

  success(message: string) {
    console.log('SUCCESS: ' + message);
    alertify.success(message);
  }

  warning(message: string) {
    console.log('WARNING: ' + message);
    alertify.warning(message);
  }

  error(message: string) {
    console.log('ERROR: ' + message);
    alertify.error(message);
  }

  message(message: string) {
    console.log('MESSAGE: ' + message);
    alertify.message(message);
  }
}

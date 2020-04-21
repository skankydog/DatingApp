import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_routeResolvers/member-detail.resolver';
import { MemberListResolver } from './_routeResolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_routeResolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_routeGuards/prevent-unsaved-changes.guard';

export function getter() {
   return localStorage.getItem('token');
}

// the following is a work-around to get past an issue in NgxGallery...
@Injectable({
   providedIn: 'root'
 })
export class CustomHammerConfig extends HammerGestureConfig {
   overrides = {
      pinch: { enable: false },
      rotate: { enable: false }
   };
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      ListsComponent,
      MessagesComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      NgxGalleryModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: getter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      })
   ],
   providers: [
      ErrorInterceptorProvider,
      AuthService,
      MemberDetailResolver,
      MemberEditResolver,
      MemberListResolver,
      { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }, // this line is added to get around a known issue in Ngx Gallery
      PreventUnsavedChanges
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {}
